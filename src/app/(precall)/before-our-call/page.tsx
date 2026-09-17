import type { Metadata } from "next";
import PrecallVideo from "../components/PrecallVideo";
import SansParametres from "../components/SansParametres";
import LienOnePager from "../components/LienOnePager";

/* La page que le prospect voit juste apres avoir reserve son appel : la video
   pre-call et les deux one-pagers.

   Une seule page depuis le 17/09 : sur les conseils d'Angelo, la video ne nomme
   plus aucun metier, elle sert donc pour toutes les niches. Les anciennes
   adresses /before-our-call/roofing et /septic redirigent ici (next.config.ts).

   Non indexee et absente du menu : on n'y arrive que par le lien du message
   post-booking ou par la redirection Cal.com.
   Doctrine : atlas/agence/mentorat-angelo/assets-precall/ */

/* Identifiant Wistia de la video (media-id du code d'embed). */
const WISTIA_ID = "1c0hslv1e7";

/* Memes chiffres que la slide 7 de la video et que les one-pagers. */
const CAS = [
  {
    id: "roofing",
    tag: "Roofing · Central Florida",
    big: "+31",
    lbl: "booked jobs in 90 days, from calls that used to go to voicemail.",
    pdf: "/precall/one-pager-roofing.pdf",
  },
  {
    id: "septic",
    tag: "Septic · Georgia",
    big: "+$94k",
    lbl: "in rebooked pumping and installs from customers they already had.",
    pdf: "/precall/one-pager-septic.pdf",
  },
];

const A_PREPARER = [
  {
    title: "Find the meeting link in your confirmation email",
    detail: "Check your spam folder if you don't see it.",
  },
  {
    title: "Join from a computer",
    detail: "I'll share my screen and show you exactly what I mean.",
  },
  {
    title: "Have a rough idea of your numbers",
    detail: "Average ticket for a small job and for a big one, calls per day, calls you miss.",
  },
];

export const metadata: Metadata = {
  title: "Before our call · NativeSquare",
  robots: { index: false, follow: false },
};

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

export default function BeforeOurCallPage() {
  return (
    <>
      <SansParametres />

      <section className="bc-hero">
        <span className="blob bc-blob-amber" aria-hidden="true" />
        <span className="blob bc-blob-sky" aria-hidden="true" />
        <div className="bc-inner">
          <div className="pill">Before our call</div>
          <h1>Your call is booked. Watch this first.</h1>
          <p className="lead">
            Five minutes on who I am and what we build for companies like yours.
            It will make our call a lot more useful.
          </p>
          <div className="bc-video corners">
            <Croisillons />
            <PrecallVideo mediaId={WISTIA_ID} />
          </div>
        </div>
      </section>

      <section className="bc-section">
        <div className="bc-wrap">
          <div className="bc-head">
            <div className="pill">Results</div>
            <h2>What it looks like for owners we&apos;ve worked with</h2>
          </div>
          <div className="bc-cases">
            {CAS.map((c) => (
              <article key={c.id} className="bc-case corners">
                <Croisillons />
                <p className="bc-tag">{c.tag}</p>
                <p className="bc-big">{c.big}</p>
                <p className="bc-lbl">{c.lbl}</p>
                <LienOnePager href={c.pdf} cas={c.id} className="bc-link">
                  Read the one-pager (PDF)
                </LienOnePager>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bc-section bc-alt">
        <div className="bc-wrap">
          <div className="bc-head">
            <div className="pill">Before the call</div>
            <h2>Three quick things</h2>
          </div>
          <ol className="bc-todo">
            {A_PREPARER.map((item, i) => (
              <li key={item.title}>
                <span className="bc-num">{i + 1}</span>
                <div>
                  <b>{item.title}</b>
                  <span>{item.detail}</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="bc-sign">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/precall/alexandre.png" alt="" width={56} height={56} />
            <div>
              <b>Alexandre</b>
              <span>Growth manager at NativeSquare</span>
            </div>
            <a href="mailto:office@nativesquare.fr">office@nativesquare.fr</a>
          </div>
        </div>
      </section>
    </>
  );
}
