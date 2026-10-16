import type { Metadata } from "next";
import Landing from "../components/Landing";
import { contenu } from "../contenu";

/* Le formulaire general : la destination de tous les boutons « Book a call » du
   site pour un visiteur qui ne vient pas d'une campagne (celui qui en vient est
   renvoye a la landing de sa campagne, voir BookingLink). Coordonnees
   obligatoires et quelques questions avant le calendrier.
   Non indexee : c'est un tunnel, pas une page a trouver sur Google. */

const c = contenu.general;

export const metadata: Metadata = {
  title: c.metaTitle,
  description: c.generique.lead,
  robots: { index: false, follow: false },
};

export default function BookPage() {
  return <Landing c={c} source="landing-book" />;
}
