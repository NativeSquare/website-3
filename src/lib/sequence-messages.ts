/**
 * Les textes de la sequence post-booking, au meme endroit pour l'apercu (page
 * interne) et pour l'envoi (Convex). Aucune dependance : ces fonctions tournent
 * dans le navigateur comme dans le moteur Convex.
 *
 * Source : la sequence d'Angelo du 18/09, adaptee dans
 * atlas/agence/mentorat-angelo/assets-precall/sequence-post-booking.md
 */

export const PAGE_PRECALL = "https://nativesquare.fr/before-our-call";

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
};

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

export type Message = {
  objet?: string;
  /* La version texte, envoyee telle quelle par SMS et jointe aux emails. */
  texte: string;
  /* Les emails ont en plus leurs paragraphes et leur bouton, pour l'habillage. */
  paragraphes?: string[];
  bouton?: { libelle: string; url: string };
  signature?: string;
};

export const EMAIL_1 = (c: Contact): Message => {
  const paragraphes = [
    `Hey ${c.prenom}, Alex here. You should have the confirmation for ${jour(c)} at ${heure(c.debut, c.fuseau)} in your inbox, with the call link.`,
    "Before we talk, I put together a page that covers exactly what we do, the results we've gotten for owners like you, and a short 5 minute video that walks through everything. The owners who watch it beforehand get a lot more out of our call. You can put it on 2x speed to go faster.",
    "If anything comes up before then, just reply to this email.",
  ];
  return {
    objet: "Before our call",
    paragraphes,
    bouton: { libelle: "Watch the 5 minute video", url: PAGE_PRECALL },
    signature: "Alex\nNativeSquare",
    texte: [...paragraphes, PAGE_PRECALL, "Alex\nNativeSquare"].join("\n\n"),
  };
};

export const SMS_1 = (c: Contact): Message => ({
  texte: `Hey ${c.prenom}, it's Alex. Confirmation email just hit your inbox. I ask everyone I meet with to watch this short video beforehand, it'll make our time together a lot more productive (you can put it on 2x speed): ${PAGE_PRECALL}

Reply STOP to opt out.`,
});

export const EMAIL_2 = (c: Contact): Message => {
  const paragraphes = [
    `Hey ${c.prenom},`,
    `Looking forward to our call on ${jour(c)} at ${heure(c.debut, c.fuseau)}. Quick note so you know exactly what to expect.`,
    "On the call, we'll cover:",
    [
      "- Where the money is leaking in your business right now: missed calls, slow follow-up, dead leads.",
      "- How companies like yours book more jobs without hiring anyone.",
      `- A plan for what we'd build inside ${c.entreprise || "your business"}, and what it would be worth.`,
    ].join("\n"),
    "I also put together a one-pager that shows exactly what we did for a company like yours. It's on the same page as the video, along with what to have ready for our call.",
  ];
  return {
    objet: `What we'll cover on ${jour(c)}`,
    paragraphes,
    bouton: { libelle: "See the video and the one-pager", url: PAGE_PRECALL },
    signature: "Talk soon,\nAlex\nNativeSquare",
    texte: [...paragraphes, PAGE_PRECALL, "Talk soon,\nAlex\nNativeSquare"].join("\n\n"),
  };
};

export const SMS_2 = (c: Contact): Message => ({
  texte: c.note
    ? `Hey ${c.prenom}, looking forward to our call on ${jour(c)} at ${heure(c.debut, c.fuseau)}. Had a thought about ${c.note} I want to get into. Did you get a chance to watch that video? It's worth the 5 minutes before we hop on: ${PAGE_PRECALL}`
    : `Hey ${c.prenom}, looking forward to our call on ${jour(c)} at ${heure(c.debut, c.fuseau)}. Did you get a chance to watch that video I sent? It's worth the 5 minutes before we hop on: ${PAGE_PRECALL}`,
});

export const EMAIL_3 = (c: Contact): Message => {
  const paragraphes = [
    `Hey ${c.prenom}, we're on in 30 minutes. ${phraseLien(c)}`,
    "Everything else is in one place: the one-pager I put together, the results we've gotten for other owners, and how we did it. If you have a few minutes before we get on, take a look. Our conversation will be a lot more productive having seen it first.",
  ];
  return {
    objet: "We're on in 30 minutes",
    paragraphes,
    bouton: { libelle: "Open the page", url: PAGE_PRECALL },
    signature: "See you soon.\nAlex",
    texte: [...paragraphes, PAGE_PRECALL, "See you soon.\nAlex"].join("\n\n"),
  };
};

export const SMS_3 = (c: Contact): Message => ({
  texte: `Hey ${c.prenom}, we're on in 30. Call link is in your email. If you haven't had a chance to watch the video yet, no worries. If you can watch it now, it'll make our conversation a lot more productive: ${PAGE_PRECALL}`,
});
