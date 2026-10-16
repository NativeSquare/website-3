/**
 * L'identifiant de visite pose par `/api/visite`. C'est lui qui relie la pub
 * au rendez-vous : il part en parametre vers Cal.com, qui le renvoie dans son
 * webhook.
 */
export const COOKIE_VISITE = "ns_visite";

/**
 * La landing d'ou vient la personne quand elle est arrivee par une campagne.
 * Pose par `/api/visite` seulement (jamais depuis l'URL), il suit la personne
 * sur tout le site : le bouton « Book a call » le lit pour la ramener au
 * formulaire de sa campagne au lieu de la laisser reserver sans coordonnees.
 */
export const COOKIE_LANDING = "ns_landing";

/* Les landings qui ont leur propre formulaire de campagne. Une valeur hors
   liste dans le cookie est ignoree. */
export const LANDINGS_CAMPAGNE = ["/hvac"] as const;
export type LandingCampagne = (typeof LANDINGS_CAMPAGNE)[number];

/* Le cookie ne se pose que si l'arrivee porte le bon UTM : `utm_campaign` doit
   nommer la campagne de cette landing (« HVAC leads ABO 07-10-2026 » pour
   /hvac). Ouvrir la landing seul, ou avec un UTM d'une autre source, ne le pose
   pas. A adapter si une campagne est renommee sans ce mot. */
export const UTM_CAMPAGNE_DE_LA_LANDING: Record<LandingCampagne, RegExp> = {
  "/hvac": /hvac/i,
};

function lire(nom: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const trouve = document.cookie
    .split("; ")
    .find((morceau) => morceau.startsWith(`${nom}=`));
  return trouve ? decodeURIComponent(trouve.slice(nom.length + 1)) : undefined;
}

export function lireVisiteId(): string | undefined {
  return lire(COOKIE_VISITE);
}

export function lireLanding(): LandingCampagne | undefined {
  const valeur = lire(COOKIE_LANDING);
  return LANDINGS_CAMPAGNE.find((l) => l === valeur);
}
