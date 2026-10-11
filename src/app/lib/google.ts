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
 * Les listes de visiteurs de Google Ads (Audience manager) ne filtrent que sur
 * l'adresse de la page, sauf si le tag envoie certains parametres : la doc de
 * Google dit que `pagetype` et `event` ajoutent des options au menu « Action »
 * du createur de listes (https://support.google.com/google-ads/answer/2454064).
 * Chaque etape envoie donc aussi un page_view qui porte ces deux parametres,
 * pour pouvoir faire une liste « a laisse son contact, n'a pas reserve ».
 *
 * Le tag s'initialise dans un effet du layout, apres ceux de la page : un
 * evenement envoye au montage doit attendre un instant. Sans tag (page
 * francaise, identifiant vide), l'evenement est abandonne apres 3 secondes.
 */
/* Les valeurs different des noms d'evenements : Google reprend le parametre
   `event` comme nom d'evenement, on ne veut pas de doublons dans les rapports. */
const ETAPES: Record<string, string> = {
  quiz_start: "etape_quiz",
  generate_lead: "etape_contact",
  qualify_lead: "etape_qualifie",
  schedule: "etape_reserve",
};

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
        const etape = ETAPES[evenement];
        if (etape) window.gtag("event", "page_view", { pagetype: etape, event: etape });
      } catch {
        /* La mesure ne gene jamais la page. */
      }
      return;
    }
    if (++essais < 15) window.setTimeout(envoyer, 200);
  };
  envoyer();
}
