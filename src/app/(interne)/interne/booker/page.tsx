import type { Metadata } from "next";
import { acces } from "../../../lib/interne";
import Booker from "./Booker";
import Entrer from "./Entrer";

/* La page qu'Alexandre ouvre pendant un appel : il remplit la fiche, voit les
   creneaux dans les deux fuseaux, relit ce qui partira, et confirme. La
   reservation part chez Cal.com et la sequence post-booking se programme.

   Doctrine : atlas/agence/mentorat-angelo/assets-precall/sequence-post-booking.md */

export const metadata: Metadata = {
  title: "Booker · interne",
  robots: { index: false, follow: false },
};

export default async function BookerPage() {
  if (!(await acces())) return <Entrer />;
  return <Booker />;
}
