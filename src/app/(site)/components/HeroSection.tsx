import BookingLink from "./BookingLink";
import HeroVideo from "./HeroVideo";
import type { Dict } from "../content";

export default function HeroSection({ t }: { t: Dict }) {
  return (
    <section className="hero">
      <HeroVideo />
      {/* Template hero art (desktop left/right, tablet-mobile md) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-art left" src="/art/hero-left.svg" alt="" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-art right" src="/art/hero-right.svg" alt="" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="hero-art md" src="/art/hero-md.svg" alt="" aria-hidden="true" />
      <span className="hero-veil" aria-hidden="true"></span>
      <div className="hero-inner">
        <div className="pill">{t.hero.kicker}</div>
        <h1>{t.hero.h1}</h1>
        <p className="lead">{t.hero.lead}</p>
        <div className="hero-ctas">
          <BookingLink source="hero" className="btn btn-primary">
            {t.nav.bookCall}
          </BookingLink>
        </div>
      </div>
    </section>
  );
}
