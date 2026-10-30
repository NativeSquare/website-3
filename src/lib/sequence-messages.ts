/**
 * Les textes de la sequence post-booking, au meme endroit pour l'apercu (page
 * interne) et pour l'envoi (Convex). Aucune dependance externe : ces fonctions
 * tournent dans le navigateur comme dans le moteur Convex.
 *
 * Source : la sequence d'Angelo du 18/09, refaite le 30/10/2026 (confirmation
 * par YES, liens suivis) dans
 * atlas/agence/mentorat-angelo/assets-precall/sequence-confirmation-oui-v5-2026-10-30.md
 *
 * Les etapes : B1 (a la reservation, « reply YES »), B2 (no show risk), B3 (la
 * confirmation, `EMAIL_1` et `SMS_1`), puis mi-chemin (`EMAIL_2`, `SMS_2`) et 30
 * minutes avant (`EMAIL_3`, `SMS_3`).
 */

import { LIEN_CAS, LIEN_GUIDE, LIEN_VIDEO } from "./relance";

export const PAGE_PRECALL = LIEN_VIDEO;

/* Les pages qu'un message montre. L'envoi passe une fonction qui ajoute le suivi
   (campagne, canal, message, identifiant du lead) ; l'apercu garde les adresses
   nues. */
export type Lien = (page: "guide" | "video" | "roofing" | "septic", contenu?: string) => string;

export const SANS_SUIVI: Lien = (page) =>
  page === "guide" ? LIEN_GUIDE : page === "video" ? PAGE_PRECALL : `${LIEN_CAS}/${page}`;

export type Contact = {
  prenom: string;
  entreprise?: string;
  /* La phrase d'Angelo : ce que le patron a dit au telephone. Facultative. */
  note?: string;
  /* Debut du rendez-vous, ISO UTC. */
  debut: string;
  /* Fuseau du prospect, pour que les heures affichees soient les siennes. */
  fuseau: string;
  lienVisio?: string;
  /* Identifiant Cal.com du rendez-vous, pour le fichier d'agenda. */
  calUid?: string;
};

/* Format des dates d'agenda : 20261008T210000Z. */
function dateAgenda(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/* Le meme titre que l'evenement Calendly et l'evenement Cal.com, pour que la
   personne n'ait pas deux titres dans son agenda (choisi par Alexandre, 22/10/2026). */
const TITRE_AGENDA = "Growth Consultation with NativeSquare";
const DUREE_APPEL = 30 * 60 * 1000;

function detailsAgenda(c: Contact, lienVideo: string): string {
  return [
    c.lienVisio ? `Video call: ${c.lienVisio}` : "",
    `Before we talk: ${lienVideo}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/* Le lien « Ajouter a Google Agenda ». */
export function lienGoogleAgenda(c: Contact, lienVideo: string = PAGE_PRECALL): string {
  const debut = new Date(c.debut);
  const fin = new Date(debut.getTime() + DUREE_APPEL);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: TITRE_AGENDA,
    dates: `${dateAgenda(debut)}/${dateAgenda(fin)}`,
    details: detailsAgenda(c, lienVideo),
    ...(c.lienVisio ? { location: c.lienVisio } : {}),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/* Le fichier .ics pour Apple Agenda, Outlook et les autres. */
export function fichierAgenda(
  c: Contact,
  lienVideo: string = PAGE_PRECALL,
): { filename: string; contenu: string } {
  const debut = new Date(c.debut);
  const fin = new Date(debut.getTime() + DUREE_APPEL);
  const echapper = (t: string) =>
    t
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  const lignes = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NativeSquare//Consultation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${c.calUid ?? dateAgenda(debut)}@nativesquare.ai`,
    `DTSTAMP:${dateAgenda(new Date())}`,
    `DTSTART:${dateAgenda(debut)}`,
    `DTEND:${dateAgenda(fin)}`,
    `SUMMARY:${echapper(TITRE_AGENDA)}`,
    `DESCRIPTION:${echapper(detailsAgenda(c, lienVideo))}`,
    ...(c.lienVisio ? [`LOCATION:${echapper(c.lienVisio)}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return {
    filename: "consultation-nativesquare.ics",
    contenu: lignes.join("\r\n") + "\r\n",
  };
}

/* « Tuesday, September 22 » dans le fuseau du prospect. */
export function jour(c: Pick<Contact, "debut" | "fuseau">): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: c.fuseau,
  }).format(new Date(c.debut));
}

/* « 5:00 PM ET » dans le fuseau demande. */
export function heure(debut: string, fuseau: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: fuseau,
  }).format(new Date(debut));
}

/* Juste l heure chez Alexandre, en 24 h : 17:30. */
export function heureParisCourte(debut: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(new Date(debut));
}

/* Le jour et l'heure chez Alexandre, pour son rappel d'appel. */
export function heureParis(debut: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(new Date(debut));
}

/* Cal.com ne donne le lien de visio que si l'evenement en a un. Sans lui, on
   renvoie vers l'email de confirmation plutot que d'ecrire une phrase bancale. */
const phraseLien = (c: Contact) =>
  c.lienVisio
    ? `Here's the call link: ${c.lienVisio}`
    : "The call link is in your confirmation email.";

/* Les prenoms arrivent tels que saisis, parfois en minuscules. */
const prenomPropre = (p: string) => p.trim().charAt(0).toUpperCase() + p.trim().slice(1);

/* « Friday » quand le rendez-vous est dans la semaine, « Friday, November 6 »
   quand il est plus loin : un jour de semaine seul serait ambigu. */
function jourCourt(c: Pick<Contact, "debut" | "fuseau">): string {
  const loin = new Date(c.debut).getTime() - Date.now() > 6 * 24 * 60 * 60 * 1000;
  if (loin) return jour(c);
  return new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: c.fuseau }).format(
    new Date(c.debut),
  );
}

/* « Friday at 2:00 PM EDT » : le rendez-vous tel que le lead le lit. */
const rdv = (c: Contact) => `${jourCourt(c)} at ${heure(c.debut, c.fuseau)}`;

export type Message = {
  objet?: string;
  pieces?: { filename: string; url: string }[];
  /* Fichier d'agenda joint, en texte (converti en base64 a l'envoi). */
  ics?: { filename: string; contenu: string };
  /* Le message, en texte brut : c'est ce qui part par e-mail comme par SMS.
     Les e-mails sont du texte simple, sans habillage : ils tombent dans la boite
     principale et ressemblent a ce qu'Alexandre ecrirait a la main. */
  texte: string;
};

/* B1 : a la reservation. Le rendez-vous n'est pas confirme tant que le lead
   n'a pas repondu YES. */
export const EMAIL_B1 = (c: Contact): Message => ({
  objet: `Please confirm your call, ${prenomPropre(c.prenom)}`,
  texte: [
    `Hey ${prenomPropre(c.prenom)},`,
    `Alex here. You asked for a slot for ${rdv(c)}. Your call is not confirmed yet. Just reply YES to confirm it.`,
    "Alex",
  ].join("\n\n"),
});

export const SMS_B1 = (c: Contact): Message => ({
  texte: `Hey ${prenomPropre(c.prenom)}, it's Alex. You asked for a slot for ${rdv(c)}. Your call is not confirmed yet. Just reply YES to confirm it.`,
});

/* B2 : no show risk. Ni YES ni signal « confirme » apres le delai. */
export const EMAIL_B2 = (c: Contact, lien: Lien = SANS_SUIVI): Message => ({
  objet: `Can you confirm ${jourCourt(c)}, ${prenomPropre(c.prenom)}?`,
  texte: [
    `Hey ${prenomPropre(c.prenom)},`,
    `Alex here. I still need your YES to keep ${rdv(c)}. Reply YES, or tell me a better time. In the meantime, here's a guide with some hard learned knowledge on how to get more HVAC jobs: ${lien("guide")}`,
    "Alex",
  ].join("\n\n"),
});

export const SMS_B2 = (c: Contact, lien: Lien = SANS_SUIVI): Message => ({
  texte: `${prenomPropre(c.prenom)}, I still need your YES to keep ${rdv(c)}. Reply YES, or tell me a better time. In the meantime, here's a guide with some hard learned knowledge on how to get more HVAC jobs: ${lien("guide")}`,
});

/* B3 : la confirmation (l'e-mail 1 d'Angelo, avec une premiere ligne nouvelle). */
export const EMAIL_1 = (c: Contact, lien: Lien = SANS_SUIVI): Message => ({
  objet: "Quick confirmation from Alex",
  ics: fichierAgenda(c, lien("video", "b3-agenda")),
  texte: [
    `Hey ${prenomPropre(c.prenom)}, perfect, you're confirmed for ${rdv(c)}. ${phraseLien(c)}`,
    "I put together a page that covers exactly what we do, the results we've gotten for owners like you, and a short 5 minute video that walks through everything. The owners who watch it beforehand get a lot more out of our call. You can put it on 2x speed to go faster.",
    `Check it out here: ${lien("video")}`,
    `Add the call to your calendar: ${lienGoogleAgenda(c, lien("video", "b3-agenda"))}`,
    "If anything comes up before then, just reply to this email. Looking forward to it.",
    "Alex\nNativeSquare",
  ].join("\n\n"),
});

export const SMS_1 = (c: Contact, lien: Lien = SANS_SUIVI): Message => ({
  texte: `Perfect, you're confirmed for ${rdv(c)}. I ask everyone I meet with to watch this short video beforehand, it'll make our time together a lot more productive (you can put it on 2x speed): ${lien("video")}`,
});

/* Mi-chemin : les deux one-pagers en liens, plus de pieces jointes. */
export const EMAIL_2 = (c: Contact, lien: Lien = SANS_SUIVI): Message => ({
  objet: `What we'll cover on ${jour(c)}`,
  texte: [
    `Hey ${prenomPropre(c.prenom)},`,
    `Looking forward to our call on ${jour(c)} at ${heure(c.debut, c.fuseau)}. I've been thinking about ${c.entreprise || "your business"} ahead of it, so here's some extra value before we talk, and a quick note on what to expect.`,
    [
      "On the call, we'll cover:",
      "- Where the money is leaking in your business right now: missed calls, slow follow-up, dead leads.",
      "- How companies like yours book more jobs without hiring anyone.",
      `- A plan for what we'd build inside ${c.entreprise || "your business"}, and what it would be worth.`,
    ].join("\n"),
    `Here are two one-pagers that show exactly what we did for other owners: ${lien("roofing")} and ${lien("septic")}. The video and what to have ready for our call are here: ${lien("video")}`,
    "Talk soon,\nAlex\nNativeSquare",
  ].join("\n\n"),
});

export const SMS_2 = (c: Contact, lien: Lien = SANS_SUIVI): Message => ({
  texte: c.note
    ? `Hey ${prenomPropre(c.prenom)}, looking forward to our call on ${jour(c)} at ${heure(c.debut, c.fuseau)}. Had a thought about ${c.note} I want to get into. Here are some examples of what owners achieve when they apply those tactics: ${lien("roofing")} ${lien("septic")}`
    : `Hey ${prenomPropre(c.prenom)}, looking forward to our call on ${jour(c)} at ${heure(c.debut, c.fuseau)}. Here are some examples of what owners achieve when they apply those tactics: ${lien("roofing")} ${lien("septic")}`,
});

export const EMAIL_3 = (c: Contact, lien: Lien = SANS_SUIVI): Message => ({
  objet: "We're on in 30 minutes",
  texte: [
    `Hey ${prenomPropre(c.prenom)}, we're on in 30 minutes. ${phraseLien(c)}`,
    "Everything else is in one place: the one-pager I put together, the results we've gotten for other owners, and how we did it. If you have a few minutes before we get on, take a look. Our conversation will be a lot more productive having seen it first.",
    lien("video"),
    "See you soon.\nAlex",
  ].join("\n\n"),
});

export const SMS_3 = (c: Contact, lien: Lien = SANS_SUIVI): Message => ({
  texte: `Hey ${prenomPropre(c.prenom)}, we're on in 30. Call link is in your email. If you haven't had a chance to watch the video yet, no worries. If you can watch it now, it'll make our conversation a lot more productive: ${lien("video")}`,
});

/* La relance d'un absent : un e-mail et un texto, une seule fois, avec le lien
   pour reprendre rendez-vous. Le calendrier public de Cal.com, sans rien dans
   l'adresse : un clic, un creneau. */
export const LIEN_REBOOK = "https://cal.com/nativesquare-office-orlgbk/discovery-call";

/* Les deux liens de la relance, avec le suivi : le calendrier (nom et e-mail
   deja remplis) et le guide (on sait qui l'ouvre). Ils viennent de
   `lienAbsent` dans relance.ts, avec l'identifiant du lead. */
export type LiensAbsent = { call: string; guide: string };

/* Textes d'Alexandre du 29/10/2026 (coquilles corrigees). */
export const EMAIL_ABSENT = (c: Contact, liens: LiensAbsent): Message => ({
  objet: "We missed each other",
  texte: [
    `Hey ${prenomPropre(c.prenom)},`,
    `We had a call set for ${jour(c)} at ${heure(c.debut, c.fuseau)} and I didn't see you on. It happens.`,
    `I know from experience you will find a ton of ideas to get more HVAC jobs on this call, so it's really worth your time. Schedule another time here: ${liens.call}`,
    `In the meantime, here is a free guide that compacts some hard learned knowledge on how to get more jobs. It's only a fraction of what we would cover during the call, but at least you get an idea. Check it here: ${liens.guide}`,
    "Talk soon\nAlex",
  ].join("\n\n"),
});

export const SMS_ABSENT = (c: Contact, liens: LiensAbsent): Message => ({
  texte: `Hey ${prenomPropre(c.prenom)}, it's Alex from NativeSquare. We had a call set for ${heure(c.debut, c.fuseau)} and I didn't see you on, it happens. I know from experience you'll find a ton of ideas to get more HVAC jobs on that call, so it's worth your time. Schedule another time here: ${liens.call}

In the meantime, here's a free guide with some hard learned knowledge. It's only a fraction of what we'd cover on the call: ${liens.guide}`,
});
