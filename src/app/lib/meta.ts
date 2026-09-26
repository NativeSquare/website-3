/**
 * Ce que le reste du site a besoin de savoir du pixel Meta : envoyer un
 * evenement s'il est charge, et lire un cookie. Aucune dependance, tourne
 * dans le navigateur seulement.
 */

export function lireCookie(nom: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const trouve = document.cookie
    .split("; ")
    .find((morceau) => morceau.startsWith(`${nom}=`));
  return trouve ? decodeURIComponent(trouve.slice(nom.length + 1)) : undefined;
}

/**
 * Un evenement standard Meta (Lead, Contact, Schedule...) avec son eventID.
 * Sans pixel charge (page francaise, identifiant absent, bloqueur), ne fait
 * rien : le site ne depend jamais de Meta.
 * Evenements standard : https://developers.facebook.com/docs/meta-pixel/reference
 */
export function suivreMeta(
  evenement: string,
  donnees: Record<string, unknown> = {},
): string | undefined {
  if (typeof window === "undefined" || !window.fbq) return undefined;
  const eventID = crypto.randomUUID();
  window.fbq("track", evenement, donnees, { eventID });
  return eventID;
}
