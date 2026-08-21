"use client";

import { useEffect } from "react";

/**
 * Enregistre l'arrivee une fois par chargement, en passant par notre propre
 * domaine. Ne rend rien et n'attend rien : si l'appel echoue, le site continue.
 *
 * Doctrine : atlas/agence/acquisition/moteur-de-mesure.md
 */
export function SuiviVisite() {
  useEffect(() => {
    const parametres: Record<string, string> = {};
    new URLSearchParams(window.location.search).forEach((valeur, cle) => {
      parametres[cle] = valeur;
    });

    void fetch("/api/visite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chemin: window.location.pathname,
        referent: document.referrer || undefined,
        parametres,
      }),
      keepalive: true,
    }).catch(() => {
      /* La mesure ne doit jamais gener la page. */
    });
  }, []);

  return null;
}
