"use client";

import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { lireVisiteId } from "../../lib/visite";

/**
 * Le calendrier Cal.com dans la page, au lieu d'un lien qui ouvre un onglet :
 * sur une landing de pub, chaque clic en moins compte.
 *
 * Embed officiel : https://cal.com/docs/developing/guides/embeds/embed-instructions
 * Evenements :     https://cal.com/docs/developing/guides/embeds/embed-events
 *
 * L'identifiant de visite est passe dans la config, comme BookingLink le passe
 * dans l'URL : Cal.com le renvoie dans son webhook, et c'est lui qui relie la
 * pub au rendez-vous. On l'attend jusqu'a 3 s (il est pose par /api/visite
 * apres le montage), puis on charge quand meme.
 */

const CAL_LINK = "nativesquare-office-orlgbk/discovery-call";
const ESPACE = "discovery-call";
const ORIGINE = "https://app.cal.com";
const SCRIPT = "https://app.cal.com/embed/embed.js";

type CalApi = ((...args: unknown[]) => void) & {
  q?: unknown[][];
  ns?: Record<string, CalApi>;
  loaded?: boolean;
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

/* Le chargeur officiel de Cal.com, reecrit lisiblement : les appels faits
   avant que embed.js soit la s'empilent dans une file qu'il rejoue. */
function chargerCal(): CalApi {
  if (window.Cal) return window.Cal;
  const empiler = (api: CalApi, args: unknown[]) => {
    api.q = api.q || [];
    api.q.push(args);
  };
  const cal: CalApi = (...args: unknown[]) => {
    const c = window.Cal as CalApi;
    if (!c.loaded) {
      c.ns = {};
      c.q = c.q || [];
      const script = document.createElement("script");
      script.src = SCRIPT;
      document.head.appendChild(script);
      c.loaded = true;
    }
    if (args[0] === "init") {
      const api: CalApi = (...a: unknown[]) => empiler(api, a);
      api.q = api.q || [];
      const espace = args[1];
      if (typeof espace === "string") {
        c.ns![espace] = c.ns![espace] || api;
        empiler(c.ns![espace], args);
        empiler(c, ["initNamespace", espace]);
      } else {
        empiler(c, args);
      }
      return;
    }
    empiler(c, args);
  };
  window.Cal = cal;
  return cal;
}

type Detail = { data?: { booking?: { uid?: string }; uid?: string } };

export default function CalendrierInline({ source }: { source: string }) {
  const conteneur = useRef<HTMLDivElement>(null);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    let arrete = false;
    const minuteurs: number[] = [];

    const demarrer = (essai: number) => {
      if (arrete || !conteneur.current) return;
      const visiteId = lireVisiteId();
      if (!visiteId && essai < 12) {
        minuteurs.push(window.setTimeout(() => demarrer(essai + 1), 250));
        return;
      }
      const Cal = chargerCal();
      Cal("init", ESPACE, { origin: ORIGINE });
      const api = Cal.ns![ESPACE];
      api("inline", {
        elementOrSelector: conteneur.current,
        calLink: CAL_LINK,
        layout: "month_view",
        config: {
          layout: "month_view",
          /* Les cles inconnues deviennent des parametres d'URL de la page de
             reservation : c'est ainsi que la question « visite » se preremplit. */
          visite: visiteId ?? "",
          ns_source: source,
        },
      });
      api("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: { light: { "cal-brand": "#0083F5" }, dark: { "cal-brand": "#0083F5" } },
      });
      api("on", {
        action: "bookingSuccessful",
        callback: (e: CustomEvent<Detail>) => {
          const d = e.detail?.data;
          const uid = d?.booking?.uid ?? d?.uid;
          posthog.capture("reservation_faite", { source, visiteId, uid });
          /* Le meme identifiant d'evenement que le serveur (cal-<uid>) : Meta
             garde un seul Schedule des deux. Sans uid, on laisse le serveur
             seul parler. */
          if (uid && window.fbq) {
            window.fbq("track", "Schedule", { content_name: "discovery-call" }, { eventID: `cal-${uid}` });
          }
        },
      });
      setCharge(true);
    };
    demarrer(0);

    return () => {
      arrete = true;
      minuteurs.forEach((m) => window.clearTimeout(m));
    };
  }, [source]);

  return (
    <div className="ld-cal" id="book">
      {!charge && <div className="ld-cal-vide">Loading the calendar…</div>}
      <div ref={conteneur} style={{ width: "100%", overflow: "auto" }} />
    </div>
  );
}
