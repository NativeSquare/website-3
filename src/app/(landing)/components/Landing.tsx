import EmmaCallCard from "../../(site)/components/EmmaCallCard";
import { content } from "../../(site)/content";
import AvisClients from "../../components/AvisClients";
import { AVIS } from "../avis";
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
 * le calendrier, puis les avis clients, sans FAQ (retour d'Angelo du
 * 09/10/2026 : le plus simple possible, pas d'etapes sous le formulaire ;
 * FAQ retiree a la demande d'Alexandre le 10/10/2026).
 */

/* Un titre ou un mot entre ** ** prend l'effet de style de la landing : un chiffre
   en bleu degrade, une phrase surlignee. */
function Titre({ texte }: { texte: string }) {
  return (
    <>
      {texte.split(/(\*\*[^*]+\*\*)/).map((m, i) =>
        m.startsWith("**") ? (
          <span key={i} className={/^\d/.test(m.slice(2)) ? "ld-mot ld-chiffre" : "ld-mot"}>
            {m.slice(2, -2)}
          </span>
        ) : (
          m
        ),
      )}
    </>
  );
}

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

/* Les avis clients, avec leurs etoiles : voir (landing)/avis.ts. */
function Avis() {
  if (AVIS.length === 0) return null;
  return (
    <section className="ld-section">
      <div className="ld-wrap">
        <div className="ld-head">
          <div className="pill">Reviews</div>
          <h2>Ask the owners who&apos;ve done it</h2>
        </div>
        <AvisClients avis={AVIS} />
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
}: {
  c: Contenu;
  porte?: Porte;
  source: string;
}) {
  const accroche = porte && c.portes ? c.portes[porte] : c.generique;

  /* Le tunnel en une colonne : l'accroche, les questions, puis le calendrier
     qui n'arrive qu'apres les questions (meeting Angelo du 08/10/2026, retour
     du 09/10/2026). */
  if (c.formulaire) {
    const f = c.formulaire;
    return (
      <>
        <section className={`ld-hero ld-c${f.variante !== "general" ? " ld-hvac" : ""}`}>
          <span className="blob bc-blob-amber" aria-hidden="true" />
          <span className="blob bc-blob-sky" aria-hidden="true" />
          <div className="ld-hero-inner">
            <div className="ld-copy">
              <div className="pill">
                {f.variante !== "general" && (
                  <svg className="ld-sablier" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M6 2h12M6 22h12M7 2c0 5 3 6 5 10M17 2c0 5-3 6-5 10M12 12c-2 4-5 5-5 10M12 12c2 4 5 5 5 10" />
                  </svg>
                )}
                {c.kicker}
              </div>
              <h1>
                <Titre texte={accroche.h1} />
              </h1>
              <p className="lead">{accroche.lead}</p>
              {accroche.rarete && (
                <p className="ld-rare">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                  {accroche.rarete}
                </p>
              )}
            </div>
            <Entonnoir
              source={source}
              variante={f.variante}
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

        <Avis />
        <Demo c={c} />
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
