import CadreLanding from "./components/CadreLanding";
import PiedLegal from "../components/PiedLegal";

/* Les landings de pubs : pas de menu, au plus un bouton, qui descend au
   calendrier de la page (voir BoutonEntete). Le visiteur vient d'une pub, il
   n'a rien d'autre a faire ici que reserver. Le haut de page (logo, bouton) est
   dans CadreLanding : il disparait sur /hvac. */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CadreLanding>{children}</CadreLanding>
      <PiedLegal />
    </>
  );
}
