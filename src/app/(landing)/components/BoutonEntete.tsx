"use client";

import { usePathname } from "next/navigation";

/**
 * Le bouton « Book a call » du menu des landings de pubs : il descend au
 * calendrier de la page. Absent de la landing HVAC, dont le tunnel guide le
 * visiteur question apres question : un bouton de reservation en haut
 * l'inviterait a sauter les questions (retour d'Angelo du 09/10/2026).
 */
export default function BoutonEntete() {
  const chemin = usePathname();
  if (chemin === "/hvac" || chemin.startsWith("/hvac/")) return null;
  return (
    <a href="#book" className="btn btn-primary btn-sm">
      Book a call
    </a>
  );
}
