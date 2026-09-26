import EmmaCallCard from "../../(site)/components/EmmaCallCard";
import { content } from "../../(site)/content";
import CalendrierInline from "./CalendrierInline";
import type { Contenu, Porte } from "../contenu";

/**
 * La landing d'une pub Meta. Une seule construction, deux variantes de mise
 * en page pour choisir :
 *   a : le calendrier apres la preuve (titre, comment ca marche, demo, calendrier)
 *   b : le calendrier dans le hero, a droite du titre, visible sans scroller
 * et un titre par porte de l'arbre d'appel (?porte=telephone|leads|estimates).
 */

export type Variante = "a" | "b";

function Etapes({ c, porte }: { c: Contenu; porte?: Porte }) {
  const accroche = porte ? c.portes[porte] : c.generique;
  return (
    <section className="ld-section ld-alt">
      <div className="ld-wrap">
        <div className="ld-head">
          <div className="pill">{c.etapesTitre}</div>
        </div>
        <div className="ld-steps">
          {accroche.etapes.map((e, i) => (
            <article className="ld-step" key={e.h3}>
              <span className="n">{i + 1}</span>
              <h3>{e.h3}</h3>
              <p>{e.p}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Demo({ c }: { c: Contenu }) {
  return (
    <section className="ld-section">
      <div className="ld-wrap ld-demo">
        <div>
          <div className="pill">The AI receptionist</div>
          <h2 style={{ marginTop: 18 }}>{c.demo.h2}</h2>
          <p>{c.demo.p}</p>
        </div>
        <EmmaCallCard t={content.en} />
      </div>
    </section>
  );
}

function Faq({ c }: { c: Contenu }) {
  return (
    <section className="ld-section ld-alt">
      <div className="ld-wrap">
        <div className="ld-head">
          <div className="pill">Questions</div>
        </div>
        <div className="ld-faq">
          {c.faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing({
  c,
  porte,
  variante,
  source,
}: {
  c: Contenu;
  porte?: Porte;
  variante: Variante;
  source: string;
}) {
  const accroche = porte ? c.portes[porte] : c.generique;

  return (
    <>
      <section className={`ld-hero${variante === "b" ? " ld-b" : ""}`}>
        <span className="blob bc-blob-amber" aria-hidden="true" />
        <span className="blob bc-blob-sky" aria-hidden="true" />
        <div className="ld-hero-inner">
          <div className="ld-copy">
            <div className="pill">{c.kicker}</div>
            <h1>{accroche.h1}</h1>
            <p className="lead">{accroche.lead}</p>
            <div className="ld-ctas">
              <a href="#book" className="btn btn-primary">
                {c.cta}
              </a>
              <span className="ld-note">{c.note}</span>
            </div>
          </div>
          {variante === "b" && <CalendrierInline source={source} />}
        </div>
      </section>

      <Etapes c={c} porte={porte} />
      <Demo c={c} />

      {variante === "a" && (
        <section className="ld-section ld-alt">
          <div className="ld-wrap">
            <div className="ld-head">
              <div className="pill">Next step</div>
              <h2>{c.reserver.h2}</h2>
              <p>{c.reserver.p}</p>
            </div>
            <CalendrierInline source={source} />
          </div>
        </section>
      )}

      <Faq c={c} />
    </>
  );
}
