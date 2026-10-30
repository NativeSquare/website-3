/**
 * La relance des leads qui ont envoye un formulaire sans prendre rendez-vous
 * (decision d'Alexandre du 26/10/2026). Ce fichier ne depend de rien : les
 * textes, les plages horaires et le calendrier des envois, pour que les memes
 * fonctions tournent dans Convex et dans les tests.
 *
 * Source des textes : atlas/agence/mentorat-angelo/assets-precall/sequence-relance-formulaire.md
 */

export const LIEN_RESERVATION = "https://nativesquare.ai/hvac/call";
const CAMPAGNE = "hvac-leads-2026-10";

/* Apres le formulaire, on attend avant de decider : le temps qu'il reserve seul. */
export const DELAI_VERIFICATION = 5 * 60 * 1000;
/* Quand Alexandre est disponible, il a une heure pour appeler avant que la
   sequence parte quand meme. */
export const DELAI_REPLI_AUTO = 60 * 60 * 1000;

const PACIFIQUE = "America/Los_Angeles";
const PARIS = "Europe/Paris";
const HEURE = 60 * 60 * 1000;

export type EtapeRelance = "r1" | "r2" | "r3";
export type Canal = "sms" | "email";
/* « manuel » : Alexandre a appele sans succes et dit de lancer. « auto » : la
   sequence part toute seule (il dort, ou l'heure d'attente est passee). */
export type ModeRelance = "auto" | "manuel";

/* ----------------------------------------------------------------- horaires */

type Parties = { annee: number; mois: number; jour: number; heure: number; minute: number };

function parties(ts: number, tz: string): Parties {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(new Date(ts));
  const lire = (type: string) => Number(p.find((x) => x.type === type)?.value);
  return {
    annee: lire("year"),
    mois: lire("month"),
    jour: lire("day"),
    heure: lire("hour"),
    minute: lire("minute"),
  };
}

/* Une heure murale dans un fuseau (« 2026-10-27 09:00, Los Angeles ») -> instant.
   Le changement d'heure est lu dans le fuseau nomme, jamais ajoute a la main. */
function murVersInstant(annee: number, mois: number, jour: number, heure: number, tz: string): number {
  const naif = Date.UTC(annee, mois - 1, jour, heure, 0);
  const ecart = (t: number) => {
    const p = parties(t, tz);
    return Date.UTC(p.annee, p.mois - 1, p.jour, p.heure, p.minute) - Math.floor(t / 60000) * 60000;
  };
  let t = naif - ecart(naif);
  t = naif - ecart(t);
  return t;
}

/* Le jour civil `decalage` jours apres celui de `ts`, dans le fuseau. */
function jourPlus(ts: number, tz: string, decalage: number): { annee: number; mois: number; jour: number } {
  const p = parties(ts, tz);
  const d = new Date(Date.UTC(p.annee, p.mois - 1, p.jour + decalage));
  return { annee: d.getUTCFullYear(), mois: d.getUTCMonth() + 1, jour: d.getUTCDate() };
}

/* Les textos ne partent qu'entre 8 h et 18 h, heure du Pacifique : c'est de
   11 h a 21 h a l'Est, donc une plage qui vaut dans les quatre fuseaux
   americains sans deviner ou est la personne. Hors plage, le texto attend le
   prochain 8 h. */
export function fenetreSms(ts: number): number {
  const p = parties(ts, PACIFIQUE);
  if (p.heure >= 8 && p.heure < 18) return ts;
  const j = jourPlus(ts, PACIFIQUE, p.heure >= 18 ? 1 : 0);
  return murVersInstant(j.annee, j.mois, j.jour, 8, PACIFIQUE);
}

/* La premiere fois qu'il est `heure` h au Pacifique apres `apres`. */
export function prochainePacifique(apres: number, heure: number): number {
  const aujourdhui = jourPlus(apres, PACIFIQUE, 0);
  const candidat = murVersInstant(aujourdhui.annee, aujourdhui.mois, aujourdhui.jour, heure, PACIFIQUE);
  if (candidat > apres) return candidat;
  const demain = jourPlus(apres, PACIFIQUE, 1);
  return murVersInstant(demain.annee, demain.mois, demain.jour, heure, PACIFIQUE);
}

/* Alexandre dort entre `debut` h et `fin` h, heure de Paris. */
export function alexandreDort(ts: number, debut = 23, fin = 8): boolean {
  const h = parties(ts, PARIS).heure;
  return debut > fin ? h >= debut || h < fin : h >= debut && h < fin;
}

/* Quand les messages partent : R1 tout de suite (le texto attend sa plage),
   R2 vers 9 h au Pacifique le lendemain, R3 trois jours apres R1. */
export function planRelances(lancement: number): Record<"r1_email" | "r1_sms" | "r2_email" | "r2_sms" | "r3_email" | "r3_sms", number> {
  const r1Sms = fenetreSms(lancement);
  /* Depuis le texto de R1 (pas depuis le lancement) : un texto repousse a 8 h
     ne doit pas etre suivi de R2 une heure plus tard. */
  const r2 = prochainePacifique(r1Sms + 12 * HEURE, 9);
  const r3 = prochainePacifique(r2 + 47 * HEURE, 9);
  return {
    r1_email: lancement,
    r1_sms: r1Sms,
    r2_email: r2,
    r2_sms: r2,
    r3_email: r3,
    r3_sms: r3,
  };
}

/* ----------------------------------------------------------- qui, et quand */

/* Les envois partent vers les numeros americains seulement, et pas vers un
   numero corrompu (un lead du 23/10 avait deux numeros colles : 22 chiffres). */
export function telephoneUS(saisi: string | undefined): string | undefined {
  if (!saisi) return undefined;
  const chiffres = saisi.replace(/\D/g, "");
  const dix = chiffres.length === 11 && chiffres.startsWith("1") ? chiffres.slice(1) : chiffres;
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(dix) ? `+1${dix}` : undefined;
}

/* Les fiches de test ne recoivent rien. */
export function leadDeTest(lead: { email: string; prenom: string; origine?: string }): boolean {
  return (
    /@(example\.com|resend\.dev)$/i.test(lead.email) ||
    /^(test|verif)$/i.test(lead.prenom.trim()) ||
    /\bTEST\b/.test(lead.origine ?? "")
  );
}

/* « just now », « last night »... : quand il a rempli le formulaire, dit comme
   Alexandre le dirait, dans le fuseau du Pacifique. */
export function quand(creeLe: number, maintenant: number): string {
  if (maintenant - creeLe < 30 * 60 * 1000) return "just now";
  const c = parties(creeLe, PACIFIQUE);
  const n = parties(maintenant, PACIFIQUE);
  const memeJour = c.annee === n.annee && c.mois === n.mois && c.jour === n.jour;
  const hier = jourPlus(maintenant, PACIFIQUE, -1);
  const veille = c.annee === hier.annee && c.mois === hier.mois && c.jour === hier.jour;
  if (memeJour) return c.heure < 5 ? "last night" : "earlier today";
  if (veille) return c.heure >= 18 ? "last night" : "yesterday";
  return "a few days ago";
}

/* ----------------------------------------------------------------- messages */

export const LIEN_GUIDE = "https://nativesquare.ai/hvac/guide";

/* Le suivi d'un lien : la campagne, le canal, l'etape, et l'identifiant du lead
   (`r`, opaque : ni e-mail ni nom). C'est ce qui dit, sur la page, QUI a clique. */
function suivi(canal: Canal, contenu: string, leadId?: string): string {
  return `utm_source=meta&utm_medium=${canal}&utm_campaign=${CAMPAGNE}&utm_content=${contenu}${leadId ? `&r=${leadId}` : ""}`;
}

export function lienRelance(etape: EtapeRelance, canal: Canal, leadId?: string): string {
  const contenu = etape === "r1" ? "call-lead" : etape === "r2" ? "relance-2" : "relance-3";
  return `${LIEN_RESERVATION}?${suivi(canal, contenu, leadId)}`;
}

export function lienGuide(etape: EtapeRelance, canal: Canal, leadId?: string): string {
  return `${LIEN_GUIDE}?${suivi(canal, `guide-${etape}`, leadId)}`;
}

/* Les liens de la relance d'un absent : le calendrier (nom et e-mail deja
   remplis grace a `r`) et le guide (`r` dit qui l'ouvre). Sans fiche lead, pas
   de `r` : les liens marchent, mais sans prefill ni suivi nominatif. */
export function lienAbsent(page: "call" | "guide", canal: Canal, leadId?: string): string {
  const base = page === "call" ? LIEN_RESERVATION : LIEN_GUIDE;
  return `${base}?${suivi(canal, page === "call" ? "absent-call" : "absent-guide", leadId)}`;
}

export type MessageRelance = { objet?: string; texte: string };

const prenomPropre = (p: string) => p.trim().charAt(0).toUpperCase() + p.trim().slice(1);

/* Quand on ne connait pas le prenom (le champ nom d'un formulaire a parfois
   recu le nom de l'entreprise), Alexandre passe « there » : « Hey there, », et
   les objets et les phrases d'accroche perdent leur prenom. */
const estAnonyme = (p: string) => p.trim() === "" || /^there$/i.test(p.trim());

export function messageRelance(
  etape: EtapeRelance,
  canal: Canal,
  c: { prenom: string; quand: string; mode: ModeRelance; leadId?: string },
): MessageRelance {
  const anonyme = estAnonyme(c.prenom);
  const prenom = anonyme ? "there" : prenomPropre(c.prenom);
  const lien = lienRelance(etape, canal, c.leadId);
  const guide = lienGuide(etape, canal, c.leadId);
  const FIXE = "I see you forgot to book a slot so we can get you started";

  if (etape === "r1" && canal === "sms") {
    const ouverture =
      c.mode === "manuel"
        ? "I just tried calling you about your application for more HVAC jobs. Congrats on getting it in."
        : `Congrats, your application for more HVAC jobs came in ${c.quand}.`;
    return {
      texte: `Hey ${prenom}, it's Alex. ${ouverture} ${FIXE}: ${lien}
In the meantime, here's a free guide we put together: 5 ways to get more jobs as an HVAC company: ${guide}
Talk soon,
Alex`,
    };
  }

  if (etape === "r1") {
    return {
      objet: anonyme ? "Congrats, your application is in" : `Congrats ${prenom}, your application is in`,
      texte: [
        `Hey ${prenom},`,
        `Alex here. Congrats, your application for more HVAC jobs came in ${c.quand}. ${FIXE}. Pick a time here: ${lien}`,
        `In the meantime, here's a free guide we put together. In our experience, these are the five things that bring an HVAC company more jobs, and it takes five minutes to read: ${guide}`,
        "If that's easier, just reply with a time and I'll set it up.",
        "Talk soon,\nAlex",
      ].join("\n\n"),
    };
  }

  if (etape === "r2" && canal === "sms") {
    return {
      texte: `Hey ${prenom}, Alex again. ${FIXE}. Pick a time here: ${lien}
Tip #1 from the guide: call back every missed call within minutes. ${guide}`,
    };
  }

  if (etape === "r2") {
    return {
      objet: anonyme ? "Still want more HVAC jobs?" : `${prenom}, still want more HVAC jobs?`,
      texte: [
        `Hey ${prenom},`,
        `Alex again. ${FIXE}.`,
        `One idea from the guide: when a customer leaves a voicemail, they are usually calling the next shop on the list. The shop that calls back first gets the chance at the job. The other four ideas are here: ${guide}`,
        `The next step is a 30-minute video call. We look at how you handle new customers today, and I tell you straight how we are going to set this up for your business. Pick a time here: ${lien}`,
        "Alex",
      ].join("\n\n"),
    };
  }

  if (canal === "sms") {
    return {
      texte: `${anonyme ? "Last one from me." : `${prenom}, last one from me.`} ${FIXE}. If you still want more HVAC jobs, here's the link: ${lien} The guide is yours to keep: ${guide}`,
    };
  }

  return {
    objet: anonyme ? "Closing the loop" : `Closing the loop, ${prenom}`,
    texte: [
      `Hey ${prenom},`,
      `This is the last message I'll send about it. ${FIXE}. If the timing isn't right, no worries at all, the guide is yours to keep: ${guide}`,
      `If you want to pick this back up, you can grab a time here: ${lien}`,
      "Alex",
    ].join("\n\n"),
  };
}
