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

## Round 3 — passe de fidélité (30/08/2026)

A et B éliminées par Alex. Passe sur les quatre restantes :
- **C (phrasso)** : 8 vrais assets du site embarqués en base64 (hero-background flippé + fondu droit, noise SVG exact, 3 textures photo des cartes douleur, 2 glows, poster du CTA final, verre du tier actif) — 776 Ko.
- **D (polarsignals)** : poster réel de la vidéo hero, patterns.svg barcode authentique (hero + CTA), wash bleu du CTA, wash violet de la section compare — 495 Ko.
- **E (search-party)** : art hero tablette/mobile (`bg-md.svg`) et arche footer mobile embarqués, rayons de blur alignés sur le template — 108 Ko.
- **F** : **reconstruite sur les screenshots de la vraie landing Verbrio** (`Bureau/Project screenshots/Verbrio/RAW/`) — hero à règles hairline dans le titre, bords aurora striés, barre prompt d'Emma (machine à écrire), 4 tuiles pastel néomorphiques flottantes, carte « Emma — Response » à surlignages + badges sources, grille How-it-works à croisillons. Le screenshot 4 étant la section mobile (pas de footer sur la réf), CTA final et footer sont extrapolés du système. Le code d'origine de cette landing n'existe ni en local, ni sur GitHub, ni sur Vercel — seuls les screenshots font foi.

## Round 4 — assets de compréhension sur les finalistes D et E (30/08/2026)

Finale entre D (polarsignals) et E (search-party). Principe vocalchat : chaque asset doit faire comprendre le produit instantanément. Ajouté dans les deux, décliné dans chaque DA :
1. **Module hero « appel en direct »** (boucle ~11-12 s) : Incoming call → Answered by AI Emma · 0.8s → 3 répliques → Appointment booked + sync CRM/calendrier.
2. **Scènes animées sur les 3 cartes douleur** : question sans réponse, compteur d'appels manqués + $ qui s'évapore, calendrier qui se télescope.
3. **Icônes statiques** : 7 bénéfices + 3 offres.
4. **Mini-schémas animés du workflow** : onde → routage à 3 branches → triangle de sync → courbe qui se dessine.
5. **Chips comparatif** (« 0.8s » vs « 9–5 ») et accent waveform sur le CTA final.
Copy inchangé ; microcopy de démo uniquement dans les assets ; `prefers-reduced-motion` fige sur l'état final. D ≈ 508 Ko, E ≈ 130 Ko.

## Sauvegarde

Le site actuel (HealthTech) est figé sur la branche `sauvegarde/site-healthtech-avant-refonte-2026-08`.

## Prochaine étape

Alex choisit une variante (ou un mix) → affinage → intégration Next dans `src/app/(site)` → GO explicite avant tout push (déploiement Vercel).

## Round 5 — passe finale sur la gagnante E (30/08/2026)

E gagne. Passe vocalchat appliquée : hero en 2 colonnes (asset à droite) avec carte persona « Sales call with Emma » (avatar memoji SVG dessiné, halo aurora conique, waveform bicolore, timer CSS live) + 3 chips flottantes ; How-it-works agrandi (~236px) avec l'arbre de routage à timer 0:08 et les vrais logos Gmail/Google Calendar/Slack/WhatsApp/HubSpot en orbite dans Seamless integration ; scène missed-revenue refaite (pièce $ qui tombe et se brise, la plus grosse des trois) ; nouveau logo NativeSquare en SVG inline (grille 3×3 bleue, opacités en cascade 1.0→0.16, 2 matrices alternatives en commentaire). ~152 Ko.

## Round 6 — repositionnement copy + architecture search-party (30/08/2026)

Copy différenciée de vocalchat, positionnement « les dernières technos pour te faire gagner plus d'argent » : H1 « We use the latest AI to make your business more money. », douleur « Where you're leaking money », FAQ générale en 12 questions, CTA « Find out what the leaks cost you ». Architecture calquée sur search-party : hero centré + panneau graphe pleine largeur (YOUR BUSINESS au centre, 6 chips services, tout converge vers « $ More booked jobs ») ; services en 5 grands panneaux alternés type « In Beta » (speed-to-lead avec timer, CRM qui se réveille, carte Emma agrandie, nuit→matin automations, orbite d'outils custom AI) ; What you get en grille de cartes à icônes. Logo 3×3 passé en noir ; « Learn More » supprimé ; Book a Call bleu unique. ~184 Ko.
