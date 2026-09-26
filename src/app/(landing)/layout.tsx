import Link from "next/link";
import NsMark from "../(site)/components/NsMark";

/* Les landings de pubs : pas de menu, un seul bouton, qui descend au
   calendrier de la page. Le visiteur vient d'une pub, il n'a rien d'autre a
   faire ici que reserver. */
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
          <a href="#book" className="btn btn-primary btn-sm">
            Book a call
          </a>
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
