"use client";

import { useEffect } from "react";

/* Les seuls parametres qui restent : ceux que posent nos propres messages
   (`r` est l'identifiant opaque du lead, les `utm_*` disent le canal et le
   message). Cal.com n'en met aucun. */
const A_GARDER = ["r", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

/* Cal.com redirige ici en ajoutant l'email, le nom et le creneau du prospect a
   l'URL (option « Forward parameters », active par defaut).
   Doc : https://cal.com/help/event-types/booking-success-page-query-params

   On les retire avant que la mesure ne lise l'adresse : rien de personnel ne
   doit partir dans PostHog ni dans le registre des visites. On garde `r` et les
   `utm_*` des liens de la sequence, pour savoir qui ouvre la page. Cet effet
   passe avant ceux de SuiviVisite et d'Analytique, rendus apres la page dans le
   layout racine (React execute les effets dans l'ordre de l'arbre). */
export default function SansParametres() {
  useEffect(() => {
    if (!window.location.search) return;
    const recus = new URLSearchParams(window.location.search);
    const gardes = new URLSearchParams();
    for (const cle of A_GARDER) {
      const valeur = recus.get(cle);
      if (valeur) gardes.set(cle, valeur);
    }
    const reste = gardes.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (reste ? `?${reste}` : ""),
    );
  }, []);

  return null;
}
