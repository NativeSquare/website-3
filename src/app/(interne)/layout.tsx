import NsMark from "../(site)/components/NsMark";

/* Outils internes. Pas de navigation, pas de bouton de reservation : ces pages
   ne sont pas faites pour un visiteur. */
export default function InterneLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container-nav nav">
          <span className="brand">
            <NsMark className="ns-mark" />
            <span>NativeSquare</span>
          </span>
          <span className="pill">Interne</span>
        </div>
      </header>
      <main className="bk-main">{children}</main>
    </>
  );
}
