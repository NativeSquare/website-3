import BookingLink from "./BookingLink";
import type { Dict } from "../content";

export default function CompareSection({ t }: { t: Dict }) {
  const c = t.compare;
  return (
    <section className="compare-sec">
      <div className="container">
        <header>
          <h2 className="feature-h2">
            <span className="eyebrow-ghost">{c.eyebrow}</span>
            {c.title}
          </h2>
        </header>
        <div className="compare-grid">
          <div className="media-frame frame-ai corners">
            <span className="inset" aria-hidden="true"></span>
            <div className="frame-head">
              <h3>{c.aiHead}</h3>
              <span className="cmp-chip chip-ai">
                <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor" aria-hidden="true">
                  <rect x="0" y="4" width="2" height="4" rx="1" />
                  <rect x="3.25" y="2" width="2" height="8" rx="1" />
                  <rect x="6.5" y="0" width="2" height="12" rx="1" />
                  <rect x="9.75" y="2.5" width="2" height="7" rx="1" />
                  <rect x="13" y="4.5" width="2" height="3" rx="1" />
                </svg>
                0.8s
              </span>
            </div>
            <ul>
              {c.aiRows.map((row) => (
                <li key={row}>
                  <b>✓</b> {row}
                </li>
              ))}
            </ul>
          </div>
          <div className="media-frame frame-trad">
            <span className="inset" aria-hidden="true"></span>
            <div className="frame-head">
              <h3>{c.tradHead}</h3>
              <span className="cmp-chip chip-trad">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9.5" />
                  <path d="M12 6.5V12l3.5 2" />
                </svg>
                9–5
              </span>
            </div>
            <ul>
              {c.tradRows.map((row) => (
                <li key={row}>
                  <b>✕</b> {row}
                </li>
              ))}
            </ul>
          </div>
          <span className="dots" style={{ top: -100, right: -140, width: 360, aspectRatio: "1.3" }} aria-hidden="true"></span>
          <span className="dots" style={{ bottom: -90, left: -120, width: 240, aspectRatio: "1.5" }} aria-hidden="true"></span>
        </div>
        <div className="compare-cta">
          <BookingLink source="compare" className="btn btn-primary">
            {t.nav.bookCall}
          </BookingLink>
        </div>
      </div>
    </section>
  );
}
