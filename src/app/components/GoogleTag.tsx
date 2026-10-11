"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Le tag Google (gtag.js), celui du compte Google Ads. Il sert a Google a
 * reconnaitre le navigateur d'un visiteur : c'est ce qui permet de construire
 * des listes de visiteurs (« a visite /hvac »), de les recibler, et de relier
 * une conversion a un clic sur une pub Google.
 *
 * Charge seulement :
 *   - quand l'identifiant ci-dessous est renseigne,
 *   - sur les pages servies en anglais (le layout passe `actif`), comme le pixel
 *     Meta : le trafic americain des pubs, pas les visiteurs francais,
 *   - jamais sur les pages internes.
 *
 * Il envoie un page_view par page. L'adresse annoncee ne garde que les
 * parametres de campagne (utm_*) et les identifiants de clic Google : l'URL de
 * /before-our-call arrive de Cal.com avec l'email et le nom du prospect, et
 * Google interdit d'y envoyer des donnees personnelles. C'est aussi ce qui
 * permet de dire dans Google Ads « a visite /hvac avec utm_content = telle
 * annonce » : le nom de l'annonce voyage dans l'adresse.
 *
 * Les conversions (Lead, Schedule) et les etapes du quiz viendront ensuite,
 * avec les memes evenements que le pixel Meta.
 *
 * Doc des listes de visiteurs : https://support.google.com/google-ads/answer/6297497
 */

/* Identifiant de destination Google Ads du tag « Nativesquare » (Google Ads >
   Outils > Data manager > Google tag). Le tag porte aussi l'identifiant
   GT-K556VR6P ; c'est l'AW- qui sert aux listes et, plus tard, aux conversions
   (send_to: AW-18311694805/<etiquette>). Ecrit en dur comme la cle PostHog : il
   part de toute facon dans le navigateur, et ca evite une variable
   d'environnement a oublier au deploiement. Vide = le tag ne se charge pas. */
const ID_GOOGLE = "AW-18311694805";

const PARAMETRES_GARDES = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/* gtag.js attend des objets `arguments` dans le dataLayer, pas des tableaux. */
function installerGtag() {
  if (window.gtag) return window.gtag;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ID_GOOGLE}`;
  document.head.appendChild(script);
  return window.gtag;
}

/* L'adresse de la page, sans rien de personnel. */
function adressePropre() {
  const source = new URL(window.location.href);
  const propre = new URL(source.origin + source.pathname);
  for (const cle of PARAMETRES_GARDES) {
    const valeur = source.searchParams.get(cle);
    if (valeur) propre.searchParams.set(cle, valeur);
  }
  return propre.toString();
}

export function GoogleTag({ actif }: { actif: boolean }) {
  const pathname = usePathname();
  const [pret, setPret] = useState(false);
  /* La page deja annoncee a Google : la premiere par la configuration, les
     suivantes par l'effet plus bas. */
  const derniere = useRef<string | null>(null);

  useEffect(() => {
    if (!ID_GOOGLE || !actif || pathname.startsWith("/interne")) return;
    const gtag = installerGtag();
    gtag("js", new Date());
    /* La configuration envoie elle-meme le page_view de la premiere page, avec
       l'adresse propre (Google l'envoie de toute facon, meme si on le coupe). */
    gtag("config", ID_GOOGLE, {
      page_location: adressePropre(),
      page_path: pathname,
    });
    derniere.current = pathname;
    setPret(true);
    /* Une seule initialisation par chargement de page. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actif]);

  /* Un page_view par changement de page du routeur applicatif. */
  useEffect(() => {
    if (!pret || !window.gtag || pathname.startsWith("/interne")) return;
    if (derniere.current === pathname) return;
    derniere.current = pathname;
    window.gtag("event", "page_view", {
      page_location: adressePropre(),
      page_path: pathname,
      page_title: document.title,
    });
  }, [pret, pathname]);

  return null;
}
