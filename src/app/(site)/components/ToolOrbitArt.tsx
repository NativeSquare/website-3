/* Tool-logo orbit — Gmail, Google Calendar, Slack, WhatsApp and HubSpot
   floating around the ink NativeSquare tile, bridged by small waveforms.
   No text besides the "31" calendar glyph, so it needs no dictionary. */
export default function ToolOrbitArt() {
  return (
    <div className="svc-orbit">
      <svg viewBox="0 0 300 200" fill="none" aria-hidden="true">
        <defs>
          <clipPath id="gcal">
            <rect x="137" y="17" width="26" height="26" rx="3" />
          </clipPath>
        </defs>
        {/* central NativeSquare tile (3×3 mark) */}
        <rect x="122" y="72" width="56" height="56" rx="16" fill="#060504" />
        <g fill="#fff">
          <rect x="135" y="85" width="8" height="8" rx="2.4" />
          <rect x="146" y="85" width="8" height="8" rx="2.4" opacity=".8" />
          <rect x="157" y="85" width="8" height="8" rx="2.4" opacity=".55" />
          <rect x="135" y="96" width="8" height="8" rx="2.4" opacity=".8" />
          <rect x="146" y="96" width="8" height="8" rx="2.4" opacity=".55" />
          <rect x="157" y="96" width="8" height="8" rx="2.4" opacity=".38" />
          <rect x="135" y="107" width="8" height="8" rx="2.4" opacity=".55" />
          <rect x="146" y="107" width="8" height="8" rx="2.4" opacity=".38" />
          <rect x="157" y="107" width="8" height="8" rx="2.4" opacity=".25" />
        </g>
        {/* Gmail */}
        <g className="orb-f">
          <rect x="34" y="28" width="44" height="44" rx="12" fill="#fff" stroke="#E6E5E5" />
          <g transform="translate(43,40.25) scale(0.2955) translate(-52,-42)">
            <path fill="#4285F4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6z" />
            <path fill="#34A853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15z" />
            <path fill="#FBBC04" d="M72 48v26L52 59v-8c0-7.42 8.47-11.65 14.4-7.2z" />
            <path fill="#EA4335" d="M72 74V48l24 18 24-18v26L96 92z" />
            <path fill="#C5221F" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2z" />
          </g>
        </g>
        {/* Google Calendar */}
        <g className="orb-f" style={{ animationDelay: ".8s" }}>
          <rect x="128" y="8" width="44" height="44" rx="12" fill="#fff" stroke="#E6E5E5" />
          <g clipPath="url(#gcal)">
            <rect x="137" y="17" width="26" height="26" fill="#4285F4" />
            <rect x="158" y="17" width="5" height="26" fill="#FBBC04" />
            <rect x="137" y="38" width="26" height="5" fill="#34A853" />
            <rect x="142.5" y="22.5" width="15.5" height="15.5" fill="#fff" />
            <path d="M158 43l5-5v5z" fill="#fff" />
            <text x="150.3" y="34" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1A73E8" style={{ fontFamily: "var(--font-sans)" }}>
              31
            </text>
          </g>
        </g>
        {/* Slack */}
        <g className="orb-f" style={{ animationDelay: "1.6s" }}>
          <rect x="222" y="28" width="44" height="44" rx="12" fill="#fff" stroke="#E6E5E5" />
          <g transform="translate(231,37) scale(0.2117)">
            <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9z" fill="#E01E5A" />
            <path d="M32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A" />
            <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2z" fill="#36C5F0" />
            <path d="M45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0" />
            <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2z" fill="#2EB67D" />
            <path d="M90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D" />
            <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9z" fill="#ECB22E" />
            <path d="M77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ECB22E" />
          </g>
        </g>
        {/* WhatsApp */}
        <g className="orb-f" style={{ animationDelay: "2.4s" }}>
          <rect x="10" y="110" width="44" height="44" rx="12" fill="#fff" stroke="#E6E5E5" />
          <circle cx="32" cy="132" r="13" fill="#25D366" />
          <path d="M32 122.4a9.8 9.8 0 0 0-8.5 14.7l-1.4 5.2 5.3-1.4a9.8 9.8 0 1 0 4.6-18.5z" fill="#fff" />
          <g transform="translate(27.3,127.4) scale(0.40)">
            <path
              fill="#25D366"
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            />
          </g>
        </g>
        {/* HubSpot */}
        <g className="orb-f" style={{ animationDelay: "3.2s" }}>
          <rect x="246" y="110" width="44" height="44" rx="12" fill="#fff" stroke="#E6E5E5" />
          <circle cx="268" cy="135" r="6.3" stroke="#FF7A59" strokeWidth="4" />
          <path d="M268 122.4v6.2" stroke="#FF7A59" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M262.7 120.9h10.6" stroke="#FF7A59" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M263.6 140.2l-4.8 4.6" stroke="#FF7A59" strokeWidth="3.2" strokeLinecap="round" />
        </g>
        {/* small waveforms bridging the tiles */}
        <rect className="orb-eq" x="64" y="114" width="4" height="8" rx="2" fill="#CDCCCB" />
        <rect className="orb-eq" style={{ animationDelay: ".15s" }} x="72" y="111" width="4" height="14" rx="2" fill="#CDCCCB" />
        <rect className="orb-eq" style={{ animationDelay: ".3s" }} x="80" y="113" width="4" height="10" rx="2" fill="#CDCCCB" />
        <rect className="orb-eq" style={{ animationDelay: ".45s" }} x="88" y="110" width="4" height="16" rx="2" fill="#CDCCCB" />
        <rect className="orb-eq" style={{ animationDelay: ".6s" }} x="96" y="113.5" width="4" height="9" rx="2" fill="#CDCCCB" />
        <rect className="orb-eq" style={{ animationDelay: ".2s" }} x="196" y="113.5" width="4" height="9" rx="2" fill="#CDCCCB" />
        <rect className="orb-eq" style={{ animationDelay: ".35s" }} x="204" y="110.5" width="4" height="15" rx="2" fill="#CDCCCB" />
        <rect className="orb-eq" style={{ animationDelay: ".5s" }} x="212" y="113" width="4" height="10" rx="2" fill="#CDCCCB" />
        <rect className="orb-eq" style={{ animationDelay: ".65s" }} x="220" y="110" width="4" height="16" rx="2" fill="#CDCCCB" />
        <rect className="orb-eq" style={{ animationDelay: ".8s" }} x="228" y="114" width="4" height="8" rx="2" fill="#CDCCCB" />
      </svg>
    </div>
  );
}
