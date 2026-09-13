import Link from "next/link";
import NsMark from "../(site)/components/NsMark";

/* Pages envoyees apres la reservation d'un appel (redirection Cal.com).
   Pas de menu ni de bouton « Book a call » : le visiteur a deja reserve. */
export default function PrecallLayout({
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
        </div>
      </header>
      <main className="bc-main">{children}</main>
      <footer className="bc-footer">
        <div className="container-nav">
          <span>© NativeSquare</span>
          <Link href="/legal">Legal</Link>
        </div>
      </footer>
    </>
  );
}
