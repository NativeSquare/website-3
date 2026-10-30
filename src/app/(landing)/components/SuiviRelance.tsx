"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Dit a la base qui ouvre la page : l'identifiant du lead est dans l'adresse
 * (`?r=...`, opaque, ni e-mail ni nom), posee par les messages de relance.
 * L'envoi attend 2,5 secondes et une page visible : un filtre de securite qui
 * ouvre le lien tout seul ne reste pas assez longtemps pour compter.
 */
export default function SuiviRelance({
  page,
}: {
  page: "guide" | "reservation" | "video" | "cas_roofing" | "cas_septic";
}) {
  const r = useSearchParams().get("r");

  useEffect(() => {
    if (!r) return;
    const minuteur = window.setTimeout(() => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/relance/vue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ r, page }),
        keepalive: true,
      }).catch(() => {});
    }, 2500);
    return () => window.clearTimeout(minuteur);
  }, [r, page]);

  return null;
}
