"use client";

import { useEffect } from "react";

/* Cal.com redirige ici en ajoutant l'email, le nom et le creneau du prospect a
   l'URL (option « Forward parameters », active par defaut).
   Doc : https://cal.com/help/event-types/booking-success-page-query-params

   On les retire avant que la mesure ne lise l'adresse : rien de personnel ne
   doit partir dans PostHog ni dans le registre des visites. Cet effet passe
   avant ceux de SuiviVisite et d'Analytique, rendus apres la page dans le
   layout racine (React execute les effets dans l'ordre de l'arbre). */
export default function SansParametres() {
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return null;
}
