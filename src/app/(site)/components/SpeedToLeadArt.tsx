import type { Dict } from "../content";

/* Speed-to-lead race: form → AI call (live 0:52 counter) → calendar.
   Base state = booked (prefers-reduced-motion shows the finished race). */
export default function SpeedToLeadArt({ t }: { t: Dict }) {
  const a = t.speedToLeadArt;
  return (
    <div className="sl-scene">
      <span className="sl-pill" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <i></i>
      </span>
      <svg className="sl-art" viewBox="0 0 520 240" fill="none" aria-hidden="true">
        <defs>
          <filter id="sl-sh" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow dx="1.5" dy="3" stdDeviation="3" floodColor="#000" floodOpacity=".07" />
          </filter>
        </defs>
        {/* form tile */}
        <g filter="url(#sl-sh)">
          <rect x="24" y="50" width="116" height="140" rx="16" fill="#fff" stroke="#E6E5E5" />
        </g>
        <rect x="36" y="64" width="52" height="8" rx="4" fill="#F0F0EF" />
        <rect x="36" y="82" width="92" height="10" rx="5" fill="#F0F0EF" />
        <rect x="36" y="98" width="92" height="10" rx="5" fill="#F0F0EF" />
        <rect x="36" y="114" width="70" height="10" rx="5" fill="#F0F0EF" />
        <rect x="36" y="138" width="92" height="24" rx="12" fill="#0083F5" />
        <text x="82" y="154" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff" style={{ fontFamily: "var(--font-sans)" }}>
          {a.submit}
        </text>
        {/* connector 1 */}
        <path d="M148 120h64" stroke="#B4B2B1" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle className="sl-d1" cx="150" cy="120" r="4" fill="#0083F5" />
        {/* phone tile + rings */}
        <rect className="sl-ring" x="218" y="68" width="104" height="104" rx="24" stroke="#0083F5" strokeWidth="1.5" />
        <rect className="sl-ring" style={{ animationDelay: ".7s" }} x="218" y="68" width="104" height="104" rx="24" stroke="#0083F5" strokeWidth="1.5" />
        <g filter="url(#sl-sh)">
          <rect x="218" y="68" width="104" height="104" rx="24" fill="#fff" stroke="#E6E5E5" />
        </g>
        <g transform="translate(246,96) scale(2)" stroke="#353231" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </g>
        {/* connector 2 */}
        <path d="M330 120h64" stroke="#B4B2B1" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle className="sl-d2" cx="332" cy="120" r="4" fill="#0083F5" />
        {/* calendar tile */}
        <g filter="url(#sl-sh)">
          <rect x="400" y="50" width="116" height="140" rx="16" fill="#fff" stroke="#E6E5E5" />
        </g>
        <rect x="428" y="78" width="60" height="52" rx="8" stroke="#353231" strokeWidth="1.8" />
        <path d="M428 92h60" stroke="#353231" strokeWidth="1.8" />
        <path d="M444 70v8M472 70v8" stroke="#353231" strokeWidth="1.8" strokeLinecap="round" />
        <path className="sl-check" d="M448 108l7 7 14-14" stroke="#6DC277" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <g className="sl-check">
          <rect x="428" y="146" width="60" height="24" rx="12" fill="#EFF9F0" stroke="#6DC277" strokeOpacity=".5" />
          <text x="458" y="162" textAnchor="middle" fontSize="12" fontWeight="600" fill="#33793E" style={{ fontFamily: "var(--font-sans)" }}>
            {a.booked}
          </text>
        </g>
        {/* labels */}
        <text x="82" y="224" textAnchor="middle" fontSize="13" fontWeight="500" fill="#827F7D" style={{ fontFamily: "var(--font-sans)" }}>
          {a.webForm}
        </text>
        <text x="270" y="224" textAnchor="middle" fontSize="13" fontWeight="500" fill="#827F7D" style={{ fontFamily: "var(--font-sans)" }}>
          {a.aiCallsBack}
        </text>
        <text x="458" y="224" textAnchor="middle" fontSize="13" fontWeight="500" fill="#827F7D" style={{ fontFamily: "var(--font-sans)" }}>
          {a.yourCalendar}
        </text>
      </svg>
    </div>
  );
}
