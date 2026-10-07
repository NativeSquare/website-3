import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* Négociation de langue — « US par défaut, FR si France, et basta » (même URL,
   pas de /fr). En production Vercel pose x-vercel-ip-country ; en local il est
   absent et Accept-Language prend le relais. Le résultat part dans un header
   de requête que les layouts/pages lisent avec headers().
   NB : proxy.ts est le nom Next 16 de l'ancien middleware.ts (convention
   dépréciée) — même contrat, même config matcher. */

export const NS_LOCALE_HEADER = "x-ns-locale";

function detectLocale(request: NextRequest): "en" | "fr" {
  /* ?lang=en / ?lang=fr force la langue — pour verifier les deux versions
     quel que soit le navigateur ou le pays. */
  const force = request.nextUrl.searchParams.get("lang");
  if (force === "en" || force === "fr") return force;

  /* nativesquare.ai : le domaine americain, toujours en anglais, quel que soit
     le pays ou la langue du navigateur. Le .fr garde la negociation. */
  const host = (request.headers.get("host") ?? "").toLowerCase();
  if (host === "nativesquare.ai" || host.endsWith(".nativesquare.ai")) return "en";

  if (request.headers.get("x-vercel-ip-country") === "FR") return "fr";

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const first = acceptLanguage.split(",")[0]?.trim().toLowerCase() ?? "";
  if (first.startsWith("fr")) return "fr";

  return "en";
}

/* Deux domaines, un site. Le .ai est le domaine americain (toujours anglais) ;
   le .fr garde les visiteurs francais. Un visiteur anglais arrive donc toujours
   sur le .ai, avec son chemin et ses parametres (utm, fbclid) intacts.
   Restent sur le .fr meme pour un visiteur anglais :
     - /interne : la console d'Alexandre ;
     - /before-our-call : les liens deja envoyes par e-mail et SMS ;
     - /legal : l'adresse de la politique de confidentialite donnee a l'operateur
       telephonique pour l'enregistrement des SMS. */
const HOTE_US = "nativesquare.ai";
const HOTES_FR = new Set(["nativesquare.fr", "www.nativesquare.fr"]);
const RESTENT_SUR_FR = ["/interne", "/before-our-call", "/legal"];

function versLeDomaineUS(request: NextRequest): NextResponse | null {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const { pathname, search } = request.nextUrl;
  const cible = new URL(pathname + search, `https://${HOTE_US}`);

  /* www.nativesquare.ai -> nativesquare.ai */
  if (host === `www.${HOTE_US}`) return NextResponse.redirect(cible, 308);

  if (!HOTES_FR.has(host) || detectLocale(request) !== "en") return null;
  if (RESTENT_SUR_FR.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;
  return NextResponse.redirect(cible, 308);
}

export function proxy(request: NextRequest) {
  const redirection = versLeDomaineUS(request);
  if (redirection) return redirection;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NS_LOCALE_HEADER, detectLocale(request));

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  /* Pages uniquement : ni l'API, ni les assets Next, ni les fichiers publics,
     ni le relais PostHog (/nsr). */
  matcher: ["/((?!api|nsr|_next/static|_next/image|.*\\..*).*)"],
};
