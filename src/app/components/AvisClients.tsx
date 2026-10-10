"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Star } from "lucide-react";
import type { Avis } from "../(landing)/avis";

/**
 * Des avis clients avec leurs etoiles. Les donnees viennent de
 * (landing)/avis.ts.
 *
 * Deux avis a la fois, comme avant. Quand il y en a plus, les deux cartes
 * changent toutes les quelques secondes, en fondu : la mise en page ne bouge
 * pas, toutes les pages sont empilees dans la meme case de la grille, donc la
 * hauteur est celle de la plus haute. Le defilement s'arrete quand on survole
 * ou touche les cartes. Pour qui demande moins d'animation, tous les avis
 * s'affichent a la suite, sans defilement.
 */

const PAR_PAGE = 2;
const DELAI_MS = 6000;
const REQUETE_MOUVEMENT = "(prefers-reduced-motion: reduce)";

function suivreMouvement(rappel: () => void) {
  const media = window.matchMedia(REQUETE_MOUVEMENT);
  media.addEventListener("change", rappel);
  return () => media.removeEventListener("change", rappel);
}

function Etoiles({ note }: { note: number }) {
  return (
    <div className="av-stars" role="img" aria-label={`${note} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
          className={i <= note ? "" : "off"}
        />
      ))}
    </div>
  );
}

export default function AvisClients({ avis }: { avis: Avis[] }) {
  const [page, setPage] = useState(0);
  const [pause, setPause] = useState(false);
  const moinsDAnimation = useSyncExternalStore(
    suivreMouvement,
    () => window.matchMedia(REQUETE_MOUVEMENT).matches,
    () => false,
  );

  const pages: Avis[][] = [];
  for (let i = 0; i < avis.length; i += PAR_PAGE) pages.push(avis.slice(i, i + PAR_PAGE));
  const defile = pages.length > 1 && !moinsDAnimation;

  useEffect(() => {
    if (!defile || pause) return;
    const minuteur = window.setInterval(
      () => setPage((p) => (p + 1) % pages.length),
      DELAI_MS,
    );
    return () => window.clearInterval(minuteur);
  }, [defile, pause, pages.length]);

  return (
    <div
      className={defile ? "av-rot" : "av-rot statique"}
      onPointerEnter={(e) => e.pointerType === "mouse" && setPause(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setPause(false)}
      onFocus={() => setPause(true)}
      onBlur={() => setPause(false)}
      onTouchStart={() => setPause(true)}
      onTouchEnd={() => window.setTimeout(() => setPause(false), 3000)}
    >
      {pages.map((groupe, i) => {
        const actif = !defile || i === page;
        return (
          <div
            key={i}
            className={actif ? "av-page actif" : "av-page"}
            aria-hidden={!actif}
            inert={!actif}
          >
            <div className="av-grid">
              {groupe.map((a) => (
                <figure className="av-card" key={`${a.nom}-${a.entreprise}`}>
                  <Etoiles note={a.note} />
                  <blockquote className="av-texte">&ldquo;{a.texte}&rdquo;</blockquote>
                  <figcaption>
                    <p className="av-nom">{a.nom}</p>
                    <p className="av-meta">
                      {[a.poste, a.entreprise, a.ville].filter(Boolean).join(", ")}
                      {a.source ? ` · ${a.source} review` : ""}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
