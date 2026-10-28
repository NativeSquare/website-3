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
