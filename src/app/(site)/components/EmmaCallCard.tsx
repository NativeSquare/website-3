import type { Dict } from "../content";

/* Persona call card — the AI-receptionist band's visual. ~11s CSS master
   timeline (globals.css): incoming ring → answered → 2-bubble exchange →
   booked → fade & loop. Static base = the finished-call end state, so
   prefers-reduced-motion shows a booked call. */

function EmmaAvatar() {
  return (
    /* Emma — hand-drawn memoji-style receptionist (owned asset) */
    <svg viewBox="0 0 64 64" focusable="false">
      <defs>
        <linearGradient id="em-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE9C0" />
          <stop offset="1" stopColor="#FFA9C6" />
        </linearGradient>
        <linearGradient id="em-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6E4F3A" />
          <stop offset="1" stopColor="#53382B" />
        </linearGradient>
        <linearGradient id="em-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4CACFF" />
          <stop offset="1" stopColor="#0083F5" />
        </linearGradient>
        <clipPath id="em-clip">
          <circle cx="32" cy="32" r="31" />
        </clipPath>
      </defs>
      <g id="emmoji-art">
        <circle cx="32" cy="32" r="31" fill="url(#em-bg)" />
        <g clipPath="url(#em-clip)">
          <path d="M10 66c0-12 9.5-18.5 22-18.5S54 54 54 66z" fill="url(#em-shirt)" />
          <path d="M27 47.5 32 55l5-7.5z" fill="#fff" />
          <path d="M27.5 38h9v8.2c0 2.6-2 4.1-4.5 4.1s-4.5-1.5-4.5-4.1z" fill="#EFAF83" />
          <path d="M27.5 40.5c1.4 1 2.9 1.5 4.5 1.5s3.1-.5 4.5-1.5V38h-9z" fill="#E29B6E" />
          <circle cx="17.8" cy="30.5" r="3.4" fill="#F6BE92" />
          <circle cx="46.2" cy="30.5" r="3.4" fill="#F6BE92" />
          <path d="M18.6 26.5c0-8.6 6-14.3 13.4-14.3s13.4 5.7 13.4 14.3c0 8.8-6 15.6-13.4 15.6s-13.4-6.8-13.4-15.6z" fill="#F9C69C" />
          <ellipse cx="28.5" cy="24" rx="6" ry="4" fill="#fff" opacity=".14" />
          <path
            d="M32 9.5c-9.6 0-15.9 6.6-15.9 15.9 0 3.9.8 7.2 2.1 9.6.4-4.6.5-7.9 2.6-9.2 2.1-1.2 6.3-1.7 9.4-4.8.8-.8 1.4-1.7 1.8-2.5.4.8 1 1.7 1.8 2.5 3.1 3.1 7.3 3.6 9.4 4.8 2.1 1.3 2.2 4.6 2.6 9.2 1.3-2.4 2.1-5.7 2.1-9.6 0-9.3-6.3-15.9-15.9-15.9z"
            fill="url(#em-hair)"
          />
          <path d="M24.5 13.6c-3.6 1.7-5.9 4.6-6.6 8.2" stroke="#8A6A50" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity=".8" />
          <path d="M24.2 27.2c1.5-1 3.2-1.1 4.6-.5M35.2 26.7c1.4-.6 3.1-.5 4.6.5" stroke="#5C4433" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="26.6" cy="30.6" r="1.7" fill="#40302A" />
          <circle cx="37.4" cy="30.6" r="1.7" fill="#40302A" />
          <circle cx="27.2" cy="30" r=".5" fill="#fff" />
          <circle cx="38" cy="30" r=".5" fill="#fff" />
          <circle cx="23.4" cy="34.6" r="2.4" fill="#FF99BD" opacity=".45" />
          <circle cx="40.6" cy="34.6" r="2.4" fill="#FF99BD" opacity=".45" />
          <path d="M31.6 32.5c.5 1.1.5 2 .1 2.6" stroke="#DF9A6C" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M27.8 36.9c1.3 1.9 3 2.8 4.9 2.8 1.4 0 2.7-.5 3.8-1.6" stroke="#B9663F" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <circle cx="17.8" cy="34.2" r=".9" fill="#F7BE3A" />
          <circle cx="46.2" cy="34.2" r=".9" fill="#F7BE3A" />
        </g>
        <path d="M17.3 26.2C17.6 17.6 23.9 11.6 32 11.6s14.4 6 14.7 14.6" stroke="#28241F" strokeWidth="2.6" strokeLinecap="round" fill="none" />
        <rect x="14.6" y="25.6" width="6.2" height="10.6" rx="3.1" fill="#28241F" />
        <path d="M18 36.4c.4 4.6 3.6 7.4 8.6 7.9" stroke="#28241F" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <circle cx="28.6" cy="44.5" r="2.7" fill="#0083F5" />
        <circle cx="28.6" cy="44.5" r="1.1" fill="#fff" opacity=".85" />
      </g>
      <circle cx="32" cy="32" r="30.4" fill="none" stroke="#fff" strokeWidth="1.6" opacity=".65" />
    </svg>
  );
}

const CALLER_WAVE = [
  { h: 8, d: undefined },
  { h: 14, d: ".12s" },
  { h: 18, d: ".24s" },
  { h: 12, d: ".36s" },
  { h: 16, d: ".48s" },
  { h: 10, d: ".6s" },
  { h: 7, d: ".72s" },
];

const EMMA_WAVE = [
  { h: 9, d: ".18s" },
  { h: 15, d: ".3s" },
  { h: 19, d: ".42s" },
  { h: 13, d: ".54s" },
  { h: 17, d: ".66s" },
  { h: 11, d: ".78s" },
  { h: 8, d: ".9s" },
];

export default function EmmaCallCard({ t }: { t: Dict }) {
  const e = t.emma;
  return (
    <div className="svc-emma">
      <div className="persona-wrap">
        <span className="persona-glow" aria-hidden="true"></span>
        <div className="persona-card">
          <div className="pc-head">
            <div className="pc-avatar" aria-hidden="true">
              <EmmaAvatar />
            </div>
            <div className="pc-id">
              <div className="pc-title">
                {e.titlePre}
                <b>{e.titleName}</b>
              </div>
              <div className="pc-wave" aria-hidden="true">
                {CALLER_WAVE.map((bar, i) => (
                  <span key={`c${i}`} className="c" style={{ height: bar.h, animationDelay: bar.d }}></span>
                ))}
                <span className="gap"></span>
                {EMMA_WAVE.map((bar, i) => (
                  <span key={`e${i}`} className="e" style={{ height: bar.h, animationDelay: bar.d }}></span>
                ))}
              </div>
            </div>
            <span className="pc-timer" aria-hidden="true">
              <span className="dot pulse"></span>
              <i></i>
            </span>
          </div>
          <div className="pc-status">
            <span className="lc-state lc-state-in">
              <span className="lc-bez">
                <span className="dot" style={{ background: "var(--yellow)" }}></span>
              </span>
              {e.incoming}
            </span>
            <span className="lc-state lc-state-ans">
              <span className="lc-bez">
                <span className="dot pulse" style={{ background: "var(--green)" }}></span>
              </span>
              {e.answered}
            </span>
          </div>
          <div className="lc-body">
            <div className="lc-row caller lc-b1">
              <span className="lc-face">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#686564" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 20.5c1.3-3.3 4.1-5 7.5-5s6.2 1.7 7.5 5" />
                </svg>
              </span>
              <div className="lc-bubble">{e.bubbleCaller}</div>
            </div>
            <div className="lc-row emma lc-b2">
              <div className="lc-bubble">{e.bubbleEmma}</div>
              <span className="lc-face">
                <svg viewBox="0 0 64 64" width="22" height="22" aria-hidden="true">
                  <use href="#emmoji-art" />
                </svg>
              </span>
            </div>
          </div>
          <div className="lc-result">
            <span className="hr-dash" style={{ top: 0 }} aria-hidden="true"></span>
            <span className="lc-chip booked lc-r1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
                <path d="M3.5 10h17M8 3v3.5M16 3v3.5M9 14.5l2.2 2.2 4-4" />
              </svg>
              {e.booked}
            </span>
            <span className="lc-chip sync lc-r2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 2.5l3.5 3.5L17 9.5M3.5 11V9.5a4 4 0 0 1 4-4h13M7 21.5L3.5 18 7 14.5M20.5 13v1.5a4 4 0 0 1-4 4h-13" />
              </svg>
              {e.synced}
            </span>
          </div>
        </div>
        <span className="pc-chip c1" aria-hidden="true">
          24/7
        </span>
        <span className="pc-chip c2" aria-hidden="true">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="#0083F5">
            <rect x="0" y="3.5" width="2.4" height="4" rx="1.2" />
            <rect x="3.4" y="1.5" width="2.4" height="8" rx="1.2" />
            <rect x="6.8" y="0" width="2.4" height="11" rx="1.2" />
            <rect x="10.2" y="2" width="2.4" height="7" rx="1.2" />
            <rect x="13.6" y="3.8" width="2.4" height="3.4" rx="1.2" />
          </svg>
          0.8s
        </span>
        <span className="pc-chip c3" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F1E1E" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
            <path d="M3.5 10h17M8 3v3.5M16 3v3.5M9 14.5l2.2 2.2 4-4" />
          </svg>
        </span>
      </div>
    </div>
  );
}
