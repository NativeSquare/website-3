import { Star } from "lucide-react";
import type { Avis } from "../(landing)/avis";

/* Des avis clients avec leurs etoiles. Les donnees viennent de
   (landing)/avis.ts, qui ne contient que de vrais avis. */

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
  return (
    <div className="av-grid">
      {avis.map((a) => (
        <figure className="av-card" key={`${a.nom}-${a.entreprise}`}>
          <Etoiles note={a.note} />
          <blockquote className="av-texte">&ldquo;{a.texte}&rdquo;</blockquote>
          <figcaption>
            <p className="av-nom">{a.nom}</p>
            <p className="av-meta">
              {[a.entreprise, a.ville].filter(Boolean).join(", ")}
              {a.source ? ` · ${a.source} review` : ""}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
