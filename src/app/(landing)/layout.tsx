import Link from "next/link";
import CadreLanding from "./components/CadreLanding";

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
      <footer className="bc-footer">
        <div className="container-nav">
          <span>© NativeSquare</span>
          <Link href="/legal">Legal</Link>
        </div>
      </footer>
    </>
  );
}
