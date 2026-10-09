/**
 * Les avis clients affiches sous le formulaire de la landing HVAC (retour
 * d'Angelo du 09/10/2026 : des avis avec des etoiles, pas seulement des
 * chiffres). Liste vide = la section ne s'affiche pas.
 *
 * PROVISOIRE : les deux avis ci-dessous sont les citations des one-pagers
 * d'exemple (voir assets-precall/video-precall-script-et-slides.md), mises
 * en ligne sur decision d'Alexandre le 09/10/2026 en attendant de vrais avis.
 * A remplacer par de vrais avis avant de depenser en pubs.
 *
 * Pour un vrai avis : texte mot pour mot, note donnee par le client, source si
 * elle est verifiable (« Google », « Trustpilot »...).
 */

export type Avis = {
  nom: string;
  entreprise: string;
  ville?: string;
  /* La note donnee par le client, de 1 a 5. */
  note: 1 | 2 | 3 | 4 | 5;
  texte: string;
  /* Ou l'avis a ete publie, quand c'est verifiable. */
  source?: string;
};

export const AVIS: Avis[] = [
  {
    nom: "Owner",
    entreprise: "Residential roofing company",
    ville: "Central Florida",
    note: 5,
    texte: "I stopped losing jobs to whoever picked up first.",
  },
  {
    nom: "Owner",
    entreprise: "Septic company",
    ville: "Georgia",
    note: 5,
    texte: "The work was sitting in our own files the whole time. We just never called.",
  },
];
