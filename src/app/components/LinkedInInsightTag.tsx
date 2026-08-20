import Script from "next/script";

const PARTNER_ID = "9563354";

declare global {
  interface Window {
    lintrk?: (action: string, data?: Record<string, unknown>) => void;
    _linkedin_partner_id?: string;
    _linkedin_data_partner_ids?: string[];
  }
}

/**
 * LinkedIn Insight Tag. Feeds the website retargeting audiences and is the
 * transport for `window.lintrk("track", { conversion_id })` conversions.
 * Mounted in the root layout so it fires on every page.
 */
export function LinkedInInsightTag() {
  return (
    <>
      <Script id="linkedin-insight" strategy="afterInteractive">
        {`
window._linkedin_partner_id = "${PARTNER_ID}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
(function (l) {
  if (!l) {
    window.lintrk = function (a, b) { window.lintrk.q.push([a, b]); };
    window.lintrk.q = [];
  }
  var s = document.getElementsByTagName("script")[0];
  var b = document.createElement("script");
  b.type = "text/javascript";
  b.async = true;
  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
  s.parentNode.insertBefore(b, s);
})(window.lintrk);
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element -- LinkedIn requires a raw pixel here */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${PARTNER_ID}&fmt=gif`}
        />
      </noscript>
    </>
  );
}
