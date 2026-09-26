"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { lireCookie } from "../lib/meta";

/**
 * Le pixel Meta, charge seulement :
 *   - quand l'identifiant est dans l'environnement Vercel (NEXT_PUBLIC_META_PIXEL_ID),
 *   - sur les pages servies en anglais (le layout passe `actif`) : le trafic
 *     americain des pubs, pas les visiteurs francais, pour qui le RGPD demande
 *     un consentement qu'on n'affiche pas,
 *   - jamais sur les pages internes.
 *
 * Il envoie PageView a chaque page, et Lead au clic sur le calendrier (voir
 * BookingLink). La reservation elle-meme (Schedule) part du serveur, depuis le
 * webhook Cal.com, dans convex/meta.ts : Meta apprend sur des rendez-vous, pas
 * sur des clics.
 *
 * Chaque evenement porte un eventID unique, la cle de dedoublonnage entre
 * navigateur et serveur. Doc : https://developers.facebook.com/docs/meta-pixel/get-started
 *
 * Plan : atlas/agence/mentorat-angelo/ads/plan-meta-ads.md, etape 2.
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
const SCRIPT = "https://connect.facebook.net/en_US/fbevents.js";

/* Le cookie durable pose par /api/visite : c'est lui qu'on donne a Meta en
   external_id, et le meme que le serveur hache dans l'evenement Schedule. */
const COOKIE_VISITEUR = "ns_visiteur";

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

/* Le stub officiel de Meta, reecrit lisiblement : les appels faits avant le
   chargement du script s'empilent dans une file que fbevents.js rejoue. */
function installerStub(): Fbq {
  if (window.fbq) return window.fbq;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  } as Fbq;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;

  const script = document.createElement("script");
  script.async = true;
  script.src = SCRIPT;
  document.head.appendChild(script);
  return fbq;
}

export function MetaPixel({ actif }: { actif: boolean }) {
  const pathname = usePathname();
  const [pret, setPret] = useState(false);

  useEffect(() => {
    if (!PIXEL_ID || !actif || pathname.startsWith("/interne")) return;
    let arrete = false;
    const minuteurs: number[] = [];

    /* Le cookie visiteur est pose par la reponse de /api/visite, quelques
       centaines de millisecondes apres le montage. On l'attend (3 s au plus)
       pour que l'initialisation le porte en external_id ; sans lui, on
       initialise quand meme. */
    const demarrer = (essai: number) => {
      if (arrete) return;
      const visiteurId = lireCookie(COOKIE_VISITEUR);
      if (!visiteurId && essai < 12) {
        minuteurs.push(window.setTimeout(() => demarrer(essai + 1), 250));
        return;
      }
      const fbq = installerStub();
      fbq("init", PIXEL_ID, visiteurId ? { external_id: visiteurId } : {});
      setPret(true);

      /* Les cookies _fbp (toujours) et _fbc (si la visite vient d'une pub,
         via fbclid) sont poses par fbevents.js quelques instants apres le
         chargement. On les accroche a la visite en cours : le webhook Cal.com
         les retrouvera pour l'evenement Schedule. */
      minuteurs.push(
        window.setTimeout(() => {
          const fbp = lireCookie("_fbp");
          const fbc = lireCookie("_fbc");
          if (!fbp && !fbc) return;
          void fetch("/api/visite/meta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fbp, fbc }),
            keepalive: true,
          }).catch(() => {
            /* La mesure ne gene jamais la page. */
          });
        }, 2500),
      );
    };
    demarrer(0);

    return () => {
      arrete = true;
      minuteurs.forEach((m) => window.clearTimeout(m));
    };
    /* Une seule initialisation par chargement de page. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actif]);

  /* Un PageView par page, y compris les navigations du routeur applicatif. */
  useEffect(() => {
    if (!pret || !window.fbq || pathname.startsWith("/interne")) return;
    window.fbq("track", "PageView", {}, { eventID: crypto.randomUUID() });
  }, [pret, pathname]);

  return null;
}
