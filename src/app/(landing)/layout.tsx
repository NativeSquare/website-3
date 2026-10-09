import Link from "next/link";
import NsMark from "../(site)/components/NsMark";
import BoutonEntete from "./components/BoutonEntete";

/* Les landings de pubs : pas de menu, au plus un bouton, qui descend au
   calendrier de la page (voir BoutonEntete). Le visiteur vient d'une pub, il
   n'a rien d'autre a faire ici que reserver. */
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="site-header bc-header">
        <div className="container-nav nav">
          <Link className="brand" href="/" aria-label="NativeSquare">
            <NsMark className="ns-mark" />
            <span>NativeSquare</span>
          </Link>
          <BoutonEntete />
        </div>
      </header>
      <main className="ld-main">{children}</main>
      <footer className="bc-footer">
        <div className="container-nav">
          <span>© NativeSquare</span>
          <Link href="/legal">Legal</Link>
        </div>
      </footer>
    </>
  );
}
