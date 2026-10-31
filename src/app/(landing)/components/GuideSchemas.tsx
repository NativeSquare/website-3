/**
 * Les schemas du guide : de petites illustrations en HTML et CSS, reprises des
 * slides de l'appel (flux en etapes, conversation, texto, liste). Pas d'image :
 * rien a charger, et le texte reste lisible.
 */

export function Flux({ etapes }: { etapes: Array<{ titre: string; sous?: string; accent?: boolean }> }) {
  return (
    <figure className="ld-g-flux" aria-hidden="true">
      {etapes.map((e, i) => (
        <div className="ld-g-flux-item" key={e.titre}>
          <div className={`ld-g-noeud${e.accent ? " accent" : ""}`}>
            <b>{e.titre}</b>
            {e.sous ? <small>{e.sous}</small> : null}
          </div>
          {i < etapes.length - 1 ? <span className="ld-g-fleche">→</span> : null}
        </div>
      ))}
    </figure>
  );
}

export function Conversation({ lignes, pied }: { lignes: Array<{ de: "client" | "nous"; texte: string }>; pied: string }) {
  return (
    <figure className="ld-g-conv" aria-hidden="true">
      {lignes.map((l) => (
        <div key={l.texte} className={`ld-g-bulle ${l.de}`}>{l.texte}</div>
      ))}
      <div className="ld-g-pastille">{pied}</div>
    </figure>
  );
}

export function Liste({ titre, lignes }: { titre: string; lignes: Array<{ nom: string; sous: string; etat: string; ok?: boolean }> }) {
  return (
    <figure className="ld-g-liste" aria-hidden="true">
      <div className="ld-g-liste-titre">{titre}</div>
      {lignes.map((l) => (
        <div className="ld-g-liste-ligne" key={l.nom}>
          <div>
            <b>{l.nom}</b>
            <small>{l.sous}</small>
          </div>
          <span className={l.ok ? "ok" : ""}>{l.etat}</span>
        </div>
      ))}
    </figure>
  );
}

/**
 * L'entonnoir d'ouverture du guide : le haut (generation de leads, parties 1 a 4)
 * et le bas (conversion, parties 5 a 8), avec ce que NativeSquare fait de
 * chaque cote. Du texte seulement, lisible au telephone.
 */
export function SchemaEntonnoir() {
  return (
    <figure className="ld-g-ent">
      <div className="ld-g-etage tof">
        <small>Top of the funnel</small>
        <b>Lead generation</b>
        <span className="ld-g-etage-sous">Strangers find you and raise a hand</span>
        <ol>
          <li><i>1</i>Search</li>
          <li><i>2</i>Ads</li>
          <li><i>3</i>Tracking</li>
          <li><i>4</i>Retargeting</li>
        </ol>
        <p><strong>We&rsquo;re here:</strong> media buying, tracking, funnel analysis, retargeting.</p>
      </div>
      <span className="ld-g-pont">↓ a lead</span>
      <div className="ld-g-etage bof">
        <small>Bottom of the funnel</small>
        <b>Lead conversion</b>
        <span className="ld-g-etage-sous">Leads become booked jobs, then repeat customers</span>
        <ol>
          <li><i>5</i>Answer and call back</li>
          <li><i>6</i>Follow-up</li>
          <li><i>7</i>Reviews and repeat</li>
          <li><i>8</i>Office</li>
        </ol>
        <p><strong>We&rsquo;re here:</strong> AI receptionist, speed-to-lead calls, follow-up, reviews, reactivation, back office.</p>
      </div>
    </figure>
  );
}
