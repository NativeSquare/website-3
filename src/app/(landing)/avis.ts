/**
 * Les avis clients affiches sous le formulaire de la landing HVAC (retour
 * d'Angelo du 09/10/2026 : de vrais avis, avec des etoiles, pas seulement des
 * chiffres).
 *
 * REGLE : uniquement de vrais avis, donnes par la personne qui les signe, avec
 * son accord. La liste est vide tant qu'on n'en a pas : la section ne s'affiche
 * pas. Les resultats « roofing +31 » et « septic +$94k » de la page pre-appel
 * sont des exemples du modele d'Angelo (voir assets-precall/video-precall-
 * script-et-slides.md) : ils n'ont rien a faire ici.
 *
 * Pour ajouter un avis : une entree ci-dessous, texte mot pour mot, note donnee
 * par le client, source si elle est verifiable (« Google », « Trustpilot »...).
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

export const AVIS: Avis[] = [];

/**
 * Avis provisoires pour la demo (demande d'Alexandre, 09/10/2026) : les deux
 * citations des one-pagers d'exemple. Ils ne s'affichent que si le lien porte
 * `?avis=demo` et que la liste ci-dessus est vide, jamais sur le lien que les
 * pubs ouvrent. A SUPPRIMER avant le lancement des pubs, quand AVIS contient
 * de vrais avis.
 */
export const AVIS_DEMO: Avis[] = [
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
