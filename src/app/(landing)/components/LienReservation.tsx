"use client";

import { useSearchParams } from "next/navigation";

/**
 * Le bouton vers le calendrier. Il garde l'identifiant du lead (`?r=`) et le
 * suivi de la campagne de l'adresse courante, pour que la page de reservation
 * sache qui arrive du guide.
 */
export default function LienReservation({
  children,
  contenu = "guide-bouton",
  surClic,
}: {
  children: React.ReactNode;
  /* Le `utm_content` du lien : d'ou le lead est parti (le bouton du guide, le popup). */
  contenu?: string;
  surClic?: () => void;
}) {
  const params = useSearchParams();
  const suite = new URLSearchParams();
  for (const cle of ["utm_source", "utm_medium", "utm_campaign", "r"]) {
    const valeur = params.get(cle);
    if (valeur) suite.set(cle, valeur);
  }
  suite.set("utm_content", contenu);
  return (
    <a className="btn btn-primary" href={`/hvac/call?${suite.toString()}`} onClick={surClic}>
      {children}
    </a>
  );
}
