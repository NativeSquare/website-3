import { telephoneInternational } from "./calendly";
import { ORIGINE_META } from "./formulaire-meta";

/**
 * Ce qu'on envoie a HighLevel pour un lead de Meta Ads : la fiche du contact et
 * la note qui garde les reponses du formulaire. Pur et sans reseau, pour que
 * convex/ghl.ts n'ait plus qu'a l'envoyer.
 */
export type LeadPourGhl = {
  prenom: string;
  nom?: string;
  email: string;
  telephone: string;
  capacite?: string;
  zone?: string;
  origine?: string;
};

export type ContactGhl = {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  source: string;
  tags: string[];
};

/* « meta-ads » sert de declencheur aux workflows ; le second tag dit par quel
   chemin le lead est arrive (formulaire de Meta ou landing). */
export const TAG_META = "meta-ads";
export const TAG_FORMULAIRE_META = "meta-instant-form";
export const TAG_LANDING = "landing-hvac";

export function contactGhl(lead: LeadPourGhl): ContactGhl {
  const formulaireMeta = lead.origine?.startsWith(ORIGINE_META) === true;
  /* Un numero illisible (« 5 », « (none) ») n'est pas envoye : HighLevel
     refuserait toute la fiche. Le lead reste joignable par e-mail. */
  const phone = telephoneInternational(lead.telephone);
  return {
    firstName: lead.prenom,
    ...(lead.nom ? { lastName: lead.nom } : {}),
    email: lead.email,
    ...(phone ? { phone } : {}),
    source: "Meta Ads",
    tags: [TAG_META, formulaireMeta ? TAG_FORMULAIRE_META : TAG_LANDING],
  };
}

export function noteGhl(lead: LeadPourGhl): string {
  const formulaireMeta = lead.origine?.startsWith(ORIGINE_META) === true;
  return [
    formulaireMeta ? "Lead from the Meta instant form." : "Lead from the HVAC landing page.",
    lead.origine ? `Source: ${lead.origine}` : undefined,
    `Jobs per month: ${lead.capacite ?? "not given"}`,
    `Area: ${lead.zone ?? "not given"}`,
  ]
    .filter(Boolean)
    .join("\n");
}
