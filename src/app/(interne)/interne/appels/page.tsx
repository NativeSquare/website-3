import type { Metadata } from "next";
import { acces } from "../../../lib/interne";
import Appels from "./Appels";
import Entrer from "../booker/Entrer";

/* La page d'appels : on charge une liste (une session de cold calling) ou les
   rappels du jour, et on enchaîne les fiches avec des boutons.

   Doctrine : atlas/agence/mentorat-angelo/ressources/console-appel-v2-2026-10-30.html */

export const metadata: Metadata = {
  title: "Appels · interne",
  robots: { index: false, follow: false },
};

export default async function AppelsPage() {
  if (!(await acces())) return <Entrer />;
  return <Appels />;
}
