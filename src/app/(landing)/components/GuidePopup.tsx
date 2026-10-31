"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import LienReservation from "./LienReservation";

/**
 * Le popup du guide (`/hvac/guide`, demande d'Alexandre du 31/10/2026) : une
 * carte qui monte en bas de l'ecran quand le lecteur a parcouru 40 % de la page,
 * une seule fois par visite. Elle ne couvre pas le texte, se ferme d'un clic ou
 * avec Echap, et son bouton mene au calendrier avec le suivi (`utm_content` =
 * `guide-popup`). Le texte est celui d'Alexandre.
 */

const CLE = "ns_guide_popup";
const SEUIL = 0.4;

export default function GuidePopup() {
  const [ouvert, setOuvert] = useState(false);

  /* Le seuil est lu une fois : sans lui, la carte s'ouvrirait a chaque defilement. */
  const dejaVu = useRef(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(CLE)) return;
    } catch {
      /* Stockage refuse : le popup s'ouvre une fois par chargement. */
    }
    function surDefilement() {
      if (dejaVu.current) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0 || window.scrollY / total < SEUIL) return;
      dejaVu.current = true;
      setOuvert(true);
      try {
        sessionStorage.setItem(CLE, "1");
      } catch {
        /* Rien : voir plus haut. */
      }
      posthog.capture("guide_popup_affiche");
      window.removeEventListener("scroll", surDefilement);
    }
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    function surTouche(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOuvert(false);
      posthog.capture("guide_popup_ferme");
    }
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [ouvert]);

  function fermer() {
    setOuvert(false);
    posthog.capture("guide_popup_ferme");
  }

  if (!ouvert) return null;
  return (
    <div className="ld-g-popup" role="dialog" aria-label="Start here">
      <button type="button" className="ld-g-popup-x" aria-label="Close" onClick={fermer}>
        &times;
      </button>
      <p>
        You can read about it, none of it matters if you don&rsquo;t take action. The easiest way is to start here.
      </p>
      <LienReservation contenu="guide-popup" surClic={() => posthog.capture("guide_popup_clic")}>
        Pick a time
      </LienReservation>
    </div>
  );
}
