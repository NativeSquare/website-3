import type { Metadata } from "next";
import { Fragment, Suspense } from "react";
import { notFound } from "next/navigation";
import SuiviRelance from "../../../(landing)/components/SuiviRelance";
import { AUTEUR, CAS, CE_QU_ON_CONSTRUIT, type NomCas } from "../cas";
import "../cas.css";

/* Un one-pager en page web, ouvert depuis le message de mi-chemin de la
   sequence (`/cases/roofing?r=...&utm_...`). Non indexe. L'ouverture est
   comptee par lead (SuiviRelance) ; la visite et ses utm le sont par
   SuiviVisite, dans le layout racine. */

export const dynamicParams = false;

export function generateStaticParams() {
  return (Object.keys(CAS) as NomCas[]).map((cas) => ({ cas }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cas: string }>;
}): Promise<Metadata> {
  const { cas } = await params;
  const donnees = CAS[cas as NomCas];
  return {
    title: donnees ? `${donnees.tag} · NativeSquare` : "NativeSquare",
    robots: { index: false, follow: false },
  };
}

function Croisillons() {
  return (
    <>
      <i className="x tl" />
      <i className="x tr" />
      <i className="x bl" />
      <i className="x br" />
    </>
  );
}

const ICONES: Record<(typeof CE_QU_ON_CONSTRUIT)[number]["icone"], { classe: string; trace: React.ReactNode }> = {
  tel: {
    classe: "o",
    trace: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z" />
    ),
  },
  relance: {
    classe: "p",
    trace: (
      <>
        <path d="M4.6 10.6A7.7 7.7 0 0 1 17 5.8M19.4 13.4A7.7 7.7 0 0 1 7 18.2" />
        <path d="M17 2.5l3.2 3.6-4.4.9zM7 21.5l-3.2-3.6 4.4-.9z" />
      </>
    ),
  },
  reglages: {
    classe: "i",
    trace: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </>
    ),
  },
};

export default async function CasPage({ params }: { params: Promise<{ cas: string }> }) {
  const { cas } = await params;
  if (!(cas in CAS)) notFound();
  const c = CAS[cas as NomCas];

  return (
    <>
      <Suspense fallback={null}>
        <SuiviRelance page={cas === "roofing" ? "cas_roofing" : "cas_septic"} />
      </Suspense>

      <section className="cas-section">
        <article className="cas-page">
          <p className="cas-pill">{c.tag}</p>
          <h1>{c.title}</h1>
          <p className="cas-sub">{c.sub}</p>

          <div className="cas-stats">
            {c.stats.map((s) => (
              <div key={s.lbl} className="cas-stat corners">
                <Croisillons />
                <p className="cas-big">{s.big}</p>
                <p className="cas-lbl">{s.lbl}</p>
              </div>
            ))}
          </div>

          <div className="cas-cols">
            <div className="cas-box corners">
              <Croisillons />
              <h2>
                <span className="cas-dot" />
                Where the money was leaking
              </h2>
              <ul>
                {c.situation.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="cas-box cas-built corners">
              <Croisillons />
              <h2>
                <span className="cas-dot" />
                What we built
              </h2>
              <ul>
                {CE_QU_ON_CONSTRUIT.map((e) => (
                  <li key={e.titre}>
                    <span className={`cas-ico ${ICONES[e.icone].classe}`}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        {ICONES[e.icone].trace}
                      </svg>
                    </span>
                    <div>
                      <b>{e.titre}</b>
                      <span>{e.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="cas-ba corners">
            <Croisillons />
            <h2>
              <span className="cas-dot" />
              Before and after
            </h2>
            <div className="cas-ba-tete" aria-hidden="true">
              <span />
              <span>Before</span>
              <span>After</span>
            </div>
            {c.ba.map(([ligne, avant, apres]) => (
              <div key={ligne} className="cas-ba-ligne">
                <span className="cas-ba-nom">{ligne}</span>
                <span className="cas-ba-avant">
                  <em>Before</em>
                  {avant}
                </span>
                <span className="cas-ba-apres">
                  <em>After</em>
                  {apres}
                </span>
              </div>
            ))}
          </div>

          <figure className="cas-quote corners">
            <Croisillons />
            <blockquote>&ldquo;{c.quote}&rdquo;</blockquote>
            <figcaption>{c.by}</figcaption>
          </figure>

          <div className="cas-timeline">
            {c.timeline.map((t, i) => (
              <Fragment key={t}>
                {i > 0 && <i aria-hidden="true">→</i>}
                <span>{t}</span>
              </Fragment>
            ))}
          </div>

          <footer className="cas-sign">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/precall/alexandre.png" alt="" width={46} height={46} />
            <div>
              <b>{AUTEUR.nom}</b> · {AUTEUR.role}
              <br />
              {AUTEUR.contact}
              <br />
              {c.tagline}
            </div>
          </footer>
        </article>
      </section>
    </>
  );
}
