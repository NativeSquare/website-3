"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

/**
 * PostHog : la couche d'analyse. Elle ne remplace pas la base Convex, qui reste
 * le registre — d'ou vient chaque rendez-vous, ce qu'il a donne, ce qu'il a
 * rapporte. PostHog repond a l'autre question : ou les gens decrochent.
 *
 * Les deux couches se recollent sur `visiteId`, pose en propriete permanente
 * par SuiviVisite des que la visite est enregistree.
 *
 * Doctrine : atlas/agence/acquisition/moteur-de-mesure.md
 */

/* Jeton du projet « Default project » (254905), region UE. En ecriture seule et
   destine aux applications publiques — PostHog le donne comme tel. Ecrit en dur
   comme le tag partenaire LinkedIn et l'identifiant de conversion : ca part de
   toute facon dans le navigateur, et ca supprime une variable d'environnement
   a oublier au deploiement. */
const CLE = "phc_sW2yDyufPLh6S4Ko5JsTPSgvBbBfpht9AKEtiU8XvLu4";

export function Analytique() {
  useEffect(() => {
    if (posthog.__loaded) return;

    posthog.init(CLE, {
      /* Le relais sur notre domaine, defini dans next.config.ts. */
      api_host: "/nsr",
      /* Sert aux liens de retour vers PostHog depuis la barre d'outils. */
      ui_host: "https://eu.posthog.com",
      /* Prend en charge les changements de page du routeur applicatif sans
         double comptage. */
      defaults: "2025-05-24",
      /* On n'identifie personne tant qu'aucun email n'est donne : un visiteur
         anonyme reste anonyme, et les evenements anonymes coutent moins cher.
         L'identification viendra a la reservation et a l'inscription. */
      person_profiles: "identified_only",
    });
  }, []);

  return null;
}
