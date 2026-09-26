import type { Metadata } from "next";
import Landing, { type Variante } from "../components/Landing";
import { contenu, lirePorte } from "../contenu";

/* La landing des pubs Meta pour les poseurs de fenetres de Floride.
   URL d'une pub : /windows?porte=telephone&utm_source=meta&utm_campaign=...
   Non indexee : le site principal reste la page canonique pour Google. */

const c = contenu.windows;

export const metadata: Metadata = {
  title: c.metaTitle,
  description: c.generique.lead,
  robots: { index: false, follow: false },
};

export default async function WindowsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const porte = lirePorte(typeof params.porte === "string" ? params.porte : undefined);
  /* ?v=b le temps de choisir la mise en page ; la variante retenue deviendra
     la seule. */
  const variante: Variante = params.v === "b" ? "b" : "a";

  return (
    <Landing
      c={c}
      porte={porte}
      variante={variante}
      source={`landing-windows${porte ? "-" + porte : ""}`}
    />
  );
}
