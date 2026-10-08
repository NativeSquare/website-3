/**
 * Les questions du formulaire de la landing HVAC, d'apres le meeting avec
 * Angelo du 08/10/2026 : le contact d'abord (un lead qu'on peut appeler meme
 * s'il ne reserve pas), puis comment il trouve ses chantiers, son chiffre
 * d'affaires, le delai, son role et son site. Le role sert a reconnaitre les
 * proprietaires et associes des managers.
 *
 * Une seule liste, lue par le formulaire et par la route `/api/lead` qui
 * refuse toute valeur hors liste. Anglais seulement : trafic americain.
 */

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
