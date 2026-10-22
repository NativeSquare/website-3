/**
 * Le webhook Calendly : verification de la signature et lecture de l'invite.
 * Aucune dependance : ces fonctions tournent dans le moteur Convex comme dans
 * Node (tests).
 *
 * Calendly pose dans `Calendly-Webhook-Signature` la valeur `t=<horodatage>,v1=<hex>` :
 * le condense HMAC-SHA256 de `<horodatage>.<corps brut>`, avec la cle de signature
 * donnee a la creation de l'abonnement.
 * Doc : https://developer.calendly.com/api-docs/4c305798a61d3-webhook-signatures
 * Evenements : https://developer.calendly.com/api-docs/c1ddc06ce1f1b-create-webhook-subscription
 */

const ENCODEUR = new TextEncoder();

async function hmacHex(cle: string, donnees: string): Promise<string> {
  const k = await crypto.subtle.importKey(
    "raw",
    ENCODEUR.encode(cle),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const brut = await crypto.subtle.sign("HMAC", k, ENCODEUR.encode(donnees));
  return Array.from(new Uint8Array(brut))
    .map((o) => o.toString(16).padStart(2, "0"))
    .join("");
}

/* Comparaison a temps constant. */
function egaux(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let ecart = 0;
  for (let i = 0; i < a.length; i++) ecart |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return ecart === 0;
}

/**
 * `toleranceS` : un message signe il y a plus longtemps est refuse, pour qu'un
 * message intercepte ne puisse pas etre rejoue.
 */
export async function signatureCalendlyValide(
  corps: string,
  entete: string | null,
  cle: string,
  maintenantS: number = Date.now() / 1000,
  toleranceS: number = 300,
): Promise<boolean> {
  if (!entete) return false;
  const parties: Record<string, string> = {};
  for (const morceau of entete.split(",")) {
    const i = morceau.indexOf("=");
    if (i > 0) parties[morceau.slice(0, i).trim()] = morceau.slice(i + 1).trim();
  }
  const t = parties.t;
  const v1 = parties.v1;
  if (!t || !v1) return false;
  const horodatage = Number(t);
  if (!Number.isFinite(horodatage) || Math.abs(maintenantS - horodatage) > toleranceS) {
    return false;
  }
  return egaux(await hmacHex(cle, `${t}.${corps}`), v1.toLowerCase());
}

/* Le telephone saisi, au format que Quo attend (+1...). Un numero a dix chiffres
   est americain. */
export function telephoneInternational(saisi: string): string | undefined {
  const chiffres = saisi.replace(/\D/g, "");
  if (saisi.trim().startsWith("+") && chiffres.length >= 10) return `+${chiffres}`;
  if (chiffres.length === 10) return `+1${chiffres}`;
  if (chiffres.length === 11 && chiffres.startsWith("1")) return `+${chiffres}`;
  return undefined;
}

type PayloadCalendly = {
  uri?: string;
  email?: string;
  name?: string;
  first_name?: string | null;
  last_name?: string | null;
  timezone?: string | null;
  text_reminder_number?: string | null;
  rescheduled?: boolean;
  old_invitee?: string | null;
  questions_and_answers?: Array<{ question?: string; answer?: string }>;
  tracking?: { utm_content?: string | null } | null;
  scheduled_event?: {
    name?: string;
    start_time?: string;
    location?: { type?: string; join_url?: string } | null;
  };
};

export type EvenementCalendly = { event?: string; payload?: PayloadCalendly };

export type Invite = {
  /* L'identifiant de l'invite chez Calendly : il tient lieu de `calUid`. */
  uid: string;
  /* La reservation qu'une reprogrammation remplace. */
  ancienUid?: string;
  annule: boolean;
  /* Annulation qui fait partie d'une reprogrammation : la nouvelle reservation
     arrive dans un autre message. */
  reprogrammation: boolean;
  titre?: string;
  prenom: string;
  nom?: string;
  nomComplet?: string;
  email: string;
  telephone?: string;
  /* La case d'accord aux SMS de l'evenement Calendly est cochee : une question
     « I agree to receive text messages... » avec une reponse. Sans elle, aucun
     texto, quel que soit le chemin par lequel la personne a reserve. */
  accordSms: boolean;
  fuseau: string;
  /* ISO UTC. */
  debut?: string;
  lienVisio?: string;
  /* La pub, quand l'adresse de reservation en portait une. */
  pub?: string;
};

/* « https://api.calendly.com/scheduled_events/AAA/invitees/BBB » devient « BBB ». */
export function dernierSegment(uri?: string | null): string | undefined {
  if (!uri) return undefined;
  const morceaux = uri.split("/").filter(Boolean);
  return morceaux[morceaux.length - 1] || undefined;
}

/* Calendly donne des microsecondes (« .000000Z ») : on ramene a trois chiffres. */
function iso(texte?: string | null): string | undefined {
  if (!texte) return undefined;
  const date = new Date(texte.replace(/(\.\d{3})\d+/, "$1"));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/**
 * Lit un message du webhook. Renvoie `null` pour un evenement qui n'est pas une
 * reservation ou une annulation, ou quand il manque l'identifiant ou l'e-mail.
 */
export function lireInvite(evenement: EvenementCalendly): Invite | null {
  if (evenement.event !== "invitee.created" && evenement.event !== "invitee.canceled") {
    return null;
  }
  const p = evenement.payload ?? {};
  const uid = dernierSegment(p.uri);
  const email = p.email?.trim();
  if (!uid || !email) return null;

  const annule = evenement.event === "invitee.canceled";
  const nomComplet = p.name?.trim() || undefined;
  const prenom = p.first_name?.trim() || nomComplet?.split(/\s+/)[0] || "there";
  const nom =
    p.last_name?.trim() ||
    (nomComplet && nomComplet.includes(" ") ? nomComplet.split(/\s+/).slice(1).join(" ") : undefined);

  /* Le telephone : la reponse a la question « Phone number » de l'evenement, sinon
     le numero des rappels par texto de Calendly. */
  const reponseTel = p.questions_and_answers?.find(
    (q) => /phone/i.test(q.question ?? "") && (q.answer ?? "").trim(),
  )?.answer;
  const telephone = telephoneInternational(reponseTel ?? p.text_reminder_number ?? "");

  /* Pour une case a cocher, Calendly donne le titre de la question (« SMS
     reminders ») et, comme reponse, le texte de la case cochee (« I agree to
     receive text messages... »). On lit les deux ensemble. */
  const accordSms = !!p.questions_and_answers?.some((q) => {
    const reponse = (q.answer ?? "").trim();
    return reponse !== "" && /agree.*(text message|sms)/i.test(`${q.question ?? ""} ${reponse}`);
  });

  const lien = p.scheduled_event?.location?.join_url;
  return {
    uid,
    ancienUid: dernierSegment(p.old_invitee),
    annule,
    reprogrammation: annule && p.rescheduled === true,
    titre: p.scheduled_event?.name,
    prenom,
    nom,
    nomComplet,
    email,
    telephone,
    accordSms,
    fuseau: p.timezone || "America/New_York",
    debut: iso(p.scheduled_event?.start_time),
    lienVisio: typeof lien === "string" && lien.startsWith("http") ? lien : undefined,
    pub: p.tracking?.utm_content || undefined,
  };
}
