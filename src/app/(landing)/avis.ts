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
