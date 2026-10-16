/**
 * Les questions du formulaire de la landing HVAC, d'apres le retour d'Angelo du
 * 09/10/2026 : deux questions faciles d'abord (combien de chantiers, quelle
 * zone), puis le contact (un lead qu'on peut appeler meme s'il ne reserve pas),
 * puis les questions de qualification juste avant le calendrier : role,
 * chiffre d'affaires, delai, comment il trouve ses chantiers, son site. Le role
 * sert a reconnaitre les proprietaires et associes des managers.
 *
 * Une seule liste, lue par le formulaire et par la route `/api/lead` qui
 * refuse toute valeur hors liste. Anglais seulement : trafic americain.
 */

export const CAPACITES = [
  "1 to 10 jobs a month",
  "11 to 25 jobs a month",
  "26 to 50 jobs a month",
  "More than 50 jobs a month",
] as const;

export const SOURCES_CHANTIERS = [
  "Word of mouth",
  "Google or local search",
  "Facebook or Instagram ads",
  "Lead services (Angi, Thumbtack...)",
  "A marketing agency",
  "Other",
] as const;

export const CHIFFRES_AFFAIRES = [
  "Under $50K",
  "$50K to $100K",
  "$100K to $250K",
  "$250K or more",
] as const;

export const DELAIS = [
  "Right now",
  "Within a month",
  "In the next 3 months",
  "Just looking",
] as const;

export const ROLES = ["Owner", "Partner", "Manager", "Other"] as const;

/**
 * Le formulaire general (`/book`), pour tout visiteur dont on ne sait pas
 * d'ou il vient : comment il nous a trouves, ce qui lui donne envie de parler,
 * son role (la liste ROLES ci-dessus) et ce que fait son entreprise.
 */
export const ORIGINES = [
  "Facebook or Instagram",
  "Google search",
  "LinkedIn",
  "A referral",
  "Podcast, YouTube or newsletter",
  "Other",
] as const;

export const MOTIFS = [
  "I miss calls or leads",
  "Leads go cold before we call back",
  "I want more booked jobs",
  "I'm curious what AI can do for my business",
  "Something else",
] as const;
