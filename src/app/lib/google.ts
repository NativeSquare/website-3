/**
 * Envoie un evenement au tag Google (voir components/GoogleTag.tsx).
 *
 * Ces evenements servent a deux choses dans Google Ads :
 *   - construire des listes de retargeting par etape du tunnel (« a laisse son
 *     contact, n'a pas reserve ») ;
 *   - devenir des conversions (Lead, Schedule) a partir des evenements detectes
 *     par le tag.
 *
 * Noms, dans l'ordre du tunnel :
 *   quiz_ecran    chaque ecran du quiz (parametre `ecran`, de 0 a 6)
 *   quiz_start    la premiere question est repondue
 *   generate_lead le contact est laisse (le Lead de Meta)
 *   qualify_lead  les questions de qualification sont finies
 *   schedule      le rendez-vous est reserve (le Schedule de Meta)
 *
 * Rien de personnel dans les parametres : ni email, ni telephone, ni nom.
 *
 * Le tag s'initialise dans un effet du layout, apres ceux de la page : un
 * evenement envoye au montage doit attendre un instant. Sans tag (page
 * francaise, identifiant vide), l'evenement est abandonne apres 3 secondes.
 */
export function suivreGoogle(
  evenement: string,
  parametres: Record<string, string | number> = {},
) {
  if (typeof window === "undefined") return;
  let essais = 0;
  const envoyer = () => {
    if (window.gtag) {
      try {
        window.gtag("event", evenement, parametres);
      } catch {
        /* La mesure ne gene jamais la page. */
      }
      return;
    }
    if (++essais < 15) window.setTimeout(envoyer, 200);
  };
  envoyer();
}
