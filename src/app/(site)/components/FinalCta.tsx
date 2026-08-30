import BookingLink from "./BookingLink";
import type { Dict } from "../content";

const WAVE_BARS = [
  { h: 10, d: undefined },
  { h: 18, d: ".12s" },
  { h: 24, d: ".24s" },
  { h: 16, d: ".36s" },
  { h: 9, d: ".48s" },
];

export default function FinalCta({ t }: { t: Dict }) {
  const c = t.finalCta;
  return (
    <section className="final-cta">
      <span className="blob cta-blob b-cyan" aria-hidden="true"></span>
      <span className="blob cta-blob b-sky" aria-hidden="true"></span>
      <span className="blob b-pink" style={{ position: "absolute", borderRadius: "100%" }} aria-hidden="true"></span>
      <span className="blob b-cream" style={{ position: "absolute", borderRadius: "100%" }} aria-hidden="true"></span>
      <span className="blob b-amber" style={{ position: "absolute", borderRadius: "100%" }} aria-hidden="true"></span>
      <span className="blob b-pink2" style={{ position: "absolute", borderRadius: "100%" }} aria-hidden="true"></span>
      <span className="veil" aria-hidden="true"></span>
      <div className="cta-wave" aria-hidden="true">
        {WAVE_BARS.map((bar, i) => (
          <span key={i} className="wbar" style={{ height: bar.h, animationDelay: bar.d }}></span>
        ))}
      </div>
      <div className="pill">{c.kicker}</div>
      <h2>{c.title}</h2>
      <p className="cta-sub">{c.sub}</p>
      <BookingLink source="cta-finale" className="btn btn-primary">
        {t.nav.bookCall}
      </BookingLink>
    </section>
  );
}
