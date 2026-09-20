import type { Metadata } from "next";
import { acces } from "../../../lib/interne";
import Campagne from "./Campagne";
import Entrer from "../booker/Entrer";

/* La campagne d'appels : les fiches lues dans Quo, la porte et la phrase a
   dire, et les quatre issues d'un appel qui s'ecrivent dans Quo. Le booker
   s'ouvre prerempli depuis chaque fiche.

   Doctrine : atlas/agence/mentorat-angelo/ressources/console-appel.html */

export const metadata: Metadata = {
  title: "Campagne · interne",
  robots: { index: false, follow: false },
};

export default async function CampagnePage() {
  if (!(await acces())) return <Entrer />;
  return <Campagne />;
}
