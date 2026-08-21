/**
 * L'identifiant de visite pose par `/api/visite`. C'est lui qui relie la pub
 * au rendez-vous : il part en parametre vers Cal.com, qui le renvoie dans son
 * webhook.
 */
export const COOKIE_VISITE = "ns_visite";

export function lireVisiteId(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const trouve = document.cookie
    .split("; ")
    .find((morceau) => morceau.startsWith(`${COOKIE_VISITE}=`));
  return trouve
    ? decodeURIComponent(trouve.slice(COOKIE_VISITE.length + 1))
    : undefined;
}
