# Propositions de refonte — landing unique sur la structure vocalchat.ai (30/08/2026)

Trois maquettes autonomes (double-clic pour ouvrir dans le navigateur, aucune dépendance). **Le contenu est identique dans les trois** — hero, douleurs, bénéfices, workflow 4 étapes, comparatif IA vs embauche, 3 offres, FAQ 12 questions, CTA final — pour que le choix ne porte que sur le design.

| Fichier | Traitement |
| --- | --- |
| `variante-a-sombre-continuite.html` | La DA actuelle du site telle quelle (fond gray-8, cartes sombres, bleu #1a79ff). Hero texte à gauche + carte agent à droite. Le moins de changement visuel. |
| `variante-b-clair-epure.html` | Mêmes typos et mêmes bleus, fond clair — la luminosité de vocalchat.ai dans notre système. Hero centré, sections alternées blanc/gris, CTA final en bloc sombre inversé. |
| `variante-c-sombre-demo-vivante.html` | Sombre avec halo bleu, hero centré au-dessus d'une **fenêtre d'appel qui se joue en boucle** (transcript animé d'un appel after-hours qui finit en RDV booké). Comparatif en vraie table 3 colonnes. La plus « produit ». |

## Cadre retenu

- **2 pages seulement** : cette landing + la page legal existante (`/legal`). Les pages `/about` et `/case-studies` disparaissent.
- **Structure = vocalchat.ai à l'identique**, positionnement et contenu compris (adapté au nom NativeSquare, phrasé retouché pour ne pas être un copié-collé mot à mot du site d'Angelo).
- **Langue** : anglais US par défaut ; français si le visiteur est associable à la France (géo Vercel `x-vercel-ip-country` + `Accept-Language` en secours, via le middleware Next). À implémenter à l'intégration, pas dans les maquettes.
- **Conservé sous le capot** : BookingLink (conversion LinkedIn + PostHog + préremplissage Cal.com), SuiviVisite, Insight Tag. Tous les boutons des maquettes sont des `#` — à l'intégration ils passent par `BookingLink` avec leur `source`.
- Le nom d'agent « Emma » et le client fictif « Summit Roofing » (variante C) sont des placeholders.

## Round 2 — six variations sur templates (30/08/2026)

Base retenue au round 1 : le design lumineux (variante B). Six déclinaisons, **contenu identique à la variante B mot pour mot**, chacune copiant la DA exacte d'un template fourni (extraction des CSS compilés du site source ; fontes propriétaires remplacées par l'équivalent Google Fonts le plus proche, noté en commentaire en tête de chaque fichier).

| Fichier | Template copié | Signature |
| --- | --- | --- |
| `variation-a-system-builder.html` | system-builder.aura.build | papier chaud #f6f5f2, titres Oswald uppercase, accent indigo, panneaux « window-chrome », bento |
| `variation-b-predictive-real.html` | predictive-real-23.aura.build | blueprint zinc #F4F4F5, angles vifs, rouge #EB5757, labels mono `GRID_SYSTEM_V.01`, nav flottante |
| `variation-c-phrasso.html` | phrasso.com | éditorial sombre #040406 + papier crème #ececdc, or/orange, zéro radius, rails verticaux |
| `variation-d-polarsignals.html` | polarsignals.com | blanc + cartes plates à coins gradient, triangle violet #726AFF, section sombre, footer noir |
| `variation-e-search-party.html` | search-party-next.vercel.app | pastel chaud #F7F5F3, croix « + » aux angles, pointillés, blobs, Figtree (≈ Aeonik) |
| `variation-f-cluely-verbrio.html` | cluely (pixelpoint) via l'implémentation Verbrio de conference.care | dégradé gris + blobs blancs flous, boutons à glow bleu radial, **la barre IA Verbrio animée en hero** (Emma) |

## Sauvegarde

Le site actuel (HealthTech) est figé sur la branche `sauvegarde/site-healthtech-avant-refonte-2026-08`.

## Prochaine étape

Alex choisit une variante (ou un mix) → affinage → intégration Next dans `src/app/(site)` → GO explicite avant tout push (déploiement Vercel).
