"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NsMark from "../../(site)/components/NsMark";
import BoutonEntete from "./BoutonEntete";

/**
 * Le haut de page et le corps des landings de pubs. Sur la landing HVAC il n'y
 * a ni logo ni menu : le logo mene a l'accueil, et un visiteur de la pub qui
 * le suit sort du tunnel (c'est arrive le 15/10/2026, un visiteur est parti par
 * le logo puis a clique sur « Book a call » de l'accueil). Meme principe que
 * le bouton d'en-tete, deja absent de /hvac.
 */
export default function CadreLanding({ children }: { children: React.ReactNode }) {
  const chemin = usePathname();
  const sansEntete = chemin.startsWith("/hvac");
  return (
    <>
      {!sansEntete && (
        <header className="site-header bc-header">
          <div className="container-nav nav">
            <Link className="brand" href="/" aria-label="NativeSquare">
              <NsMark className="ns-mark" />
              <span>NativeSquare</span>
            </Link>
            <BoutonEntete />
          </div>
        </header>
      )}
      <main className={sansEntete ? "ld-main ld-sans-entete" : "ld-main"}>{children}</main>
    </>
  );
}
