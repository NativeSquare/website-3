import { telephoneInternational } from "./calendly";

/**
 * Un lead du formulaire instantane de Meta, tel que le pont (Zapier ou Make)
 * l'envoie a la route `/meta/lead`. Les cles suivent les noms des champs de Meta
 * pour que la correspondance se fasse sans reflechir dans le pont.
 *
 * Aucun format n'est suppose : le pont envoie ce qu'il a, cette fonction garde
 * ce qui est utilisable et refuse ce qui ne l'est pas (pas d'e-mail, pas de nom).
 */
export type LeadMeta = {
  prenom: string;
  nom?: string;
  email: string;
  telephone: string;
  consentSms: boolean;
  capacite?: string;
  zone?: string;
  /* « Meta instant form | ad: H1 question | form: ... » : ce que l'alerte Slack
     affiche a la place de la pub de la visite, qu'un lead Meta n'a pas. */
  origine: string;
};

/* Ce que `leads.origine` porte pour les leads de Meta : la mutation s en sert pour
   reconnaitre un lead rejoue par le pont. */
export const ORIGINE_META = "Meta instant form";

const LONGUEUR_MAX = 200;

function texte(valeur: unknown): string | undefined {
  if (typeof valeur === "number") valeur = String(valeur);
  if (typeof valeur !== "string") return undefined;
  const propre = valeur.trim().slice(0, LONGUEUR_MAX);
  return propre === "" ? undefined : propre;
}

/* Le premier champ rempli parmi plusieurs noms possibles. */
function premier(brut: Record<string, unknown>, cles: string[]): string | undefined {
  for (const cle of cles) {
    const valeur = texte(brut[cle]);
    if (valeur) return valeur;
  }
  return undefined;
}

/* L'accord aux SMS : seulement une reponse positive claire. Une case non cochee
   arrive vide, ou « no », ou absente : dans le doute, pas d'accord. */
function accord(valeur: unknown): boolean {
  if (valeur === true) return true;
  const t = texte(valeur);
  return !!t && /^(true|yes|y|1|on|checked|agreed?|i agree)\b/i.test(t);
}

export function lireLeadMeta(brut: unknown): LeadMeta | null {
  if (!brut || typeof brut !== "object" || Array.isArray(brut)) return null;
  const b = brut as Record<string, unknown>;

  const email = premier(b, ["email", "e-mail"])?.toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  /* Meta donne un nom complet ; certains ponts le coupent deja en deux. */
  let prenom = premier(b, ["first_name", "prenom"]);
  let nom = premier(b, ["last_name", "nom"]);
  const complet = premier(b, ["full_name", "name"]);
  if (!prenom && complet) {
    const [premierMot, ...reste] = complet.split(/\s+/);
    prenom = premierMot;
    nom = nom ?? (reste.join(" ") || undefined);
  }
  if (!prenom) return null;

  /* Les exports de Meta ecrivent les numeros « p:+13055550147 ». */
  const saisi = (premier(b, ["phone", "phone_number", "telephone"]) ?? "").replace(/^p:/i, "");
  const telephone = telephoneInternational(saisi) ?? (saisi || "(none)");

  const annonce = premier(b, ["ad_name", "annonce"]);
  const formulaire = premier(b, ["form_name", "formulaire"]);
  const origine = [
    ORIGINE_META,
    annonce ? `ad: ${annonce}` : undefined,
    formulaire ? `form: ${formulaire}` : undefined,
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    prenom,
    nom,
    email,
    telephone,
    consentSms: accord(b.sms_consent ?? b.consent_sms),
    capacite: premier(b, ["jobs_per_month", "capacite"]),
    zone: premier(b, ["area", "zip_code", "zone"]),
    origine,
  };
}
