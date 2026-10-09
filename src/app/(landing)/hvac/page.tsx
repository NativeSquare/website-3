import type { Metadata } from "next";
import Landing from "../components/Landing";
import { contenu } from "../contenu";

/* La page d'arrivee des pubs video HVAC : l'ecran de fin du formulaire
   instantane Meta renvoie ici pour reserver l'appel.
   URL : /hvac?utm_source=meta&utm_medium=paid&utm_campaign=hvac-leads-2026-10
   Non indexee : le site principal reste la page canonique pour Google. */

const c = contenu.hvac;

export const metadata: Metadata = {
  title: c.metaTitle,
  description: c.generique.lead,
  robots: { index: false, follow: false },
};

export default async function HvacPage({
  searchParams,
}: {
  searchParams: Promise<{ avis?: string }>;
}) {
  /* ?avis=demo : montre les avis provisoires de (landing)/avis.ts, pour une
     demo. Le lien des pubs n'a pas ce parametre. */
  const { avis } = await searchParams;
  return <Landing c={c} source="landing-hvac" avisDemo={avis === "demo"} />;
}
