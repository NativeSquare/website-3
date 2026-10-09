import EmmaCallCard from "../../(site)/components/EmmaCallCard";
import { content } from "../../(site)/content";
import AvisClients from "../../components/AvisClients";
import { AVIS, AVIS_DEMO } from "../avis";
import CalendrierInline from "./CalendrierInline";
import Entonnoir from "./Entonnoir";
import type { Contenu, Porte } from "../contenu";

/**
 * La landing d'une pub Meta : le calendrier dans le hero, a droite du titre,
 * visible sans scroller (mise en page B retenue par Alexandre le 26/09/2026 ;
 * la mise en page A, calendrier apres la preuve, est dans l'historique git),
 * puis comment ca marche, la demo, les questions. Un titre par porte de
 * l'arbre d'appel (?porte=telephone|leads|estimates).
 *
 * La landing HVAC est un tunnel : l'accroche, les questions un ecran chacune,
 * le calendrier, puis les avis clients (quand on en a de vrais) et la FAQ
 * (retour d'Angelo du 09/10/2026 : le plus simple possible, pas d'etapes sous
 * le formulaire).
 */

function Etapes({ c, porte }: { c: Contenu; porte?: Porte }) {
  const accroche = porte && c.portes ? c.portes[porte] : c.generique;
  if (!accroche.etapes) return null;
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

/* Les avis clients, avec leurs etoiles. Rien tant qu'on n'a pas de vrais avis,
   sauf avec ?avis=demo (avis provisoires, marques comme tels) : voir
   (landing)/avis.ts. */
function Avis({ demo }: { demo: boolean }) {
  const montrerDemo = AVIS.length === 0 && demo;
  const liste = AVIS.length > 0 ? AVIS : montrerDemo ? AVIS_DEMO : [];
  if (liste.length === 0) return null;
  return (
    <section className="ld-section">
      <div className="ld-wrap">
        <div className="ld-head">
          <div className="pill">Reviews</div>
          <h2>What our clients say</h2>
        </div>
        <AvisClients avis={liste} />
        {montrerDemo && (
          <p className="av-demo">Sample reviews for the preview only.</p>
        )}
      </div>
    </section>
  );
}

function Demo({ c }: { c: Contenu }) {
  if (!c.demo) return null;
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
  source,
  avisDemo = false,
}: {
  c: Contenu;
  porte?: Porte;
  source: string;
  avisDemo?: boolean;
}) {
  const accroche = porte && c.portes ? c.portes[porte] : c.generique;

  /* Le tunnel en une colonne : l'accroche, les questions, puis le calendrier
     qui n'arrive qu'apres les questions (meeting Angelo du 08/10/2026, retour
     du 09/10/2026). */
  if (c.formulaire) {
    const f = c.formulaire;
    return (
      <>
        <section className="ld-hero ld-c">
          <span className="blob bc-blob-amber" aria-hidden="true" />
          <span className="blob bc-blob-sky" aria-hidden="true" />
          <div className="ld-hero-inner">
            <div className="ld-copy">
              <div className="pill">{c.kicker}</div>
              <h1>{accroche.h1}</h1>
              <p className="lead">{accroche.lead}</p>
            </div>
            <Entonnoir
              source={source}
              boutonContact={f.boutonContact}
              boutonFinal={f.boutonFinal}
              consentement={f.consentement}
              zoneOuverte={f.zoneOuverte}
              reserverTitre={f.reserverTitre}
              reserverTexte={f.reserverTexte}
              apresReservation={f.apresReservation}
            />
          </div>
        </section>

        <Avis demo={avisDemo} />
        <Demo c={c} />
        <Faq c={c} />
      </>
    );
  }

  return (
    <>
      <section className="ld-hero ld-b">
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
          <CalendrierInline source={source} />
        </div>
      </section>

      <Etapes c={c} porte={porte} />
      <Demo c={c} />
      <Faq c={c} />
    </>
  );
}
