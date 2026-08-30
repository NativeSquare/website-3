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
  if (request.headers.get("x-vercel-ip-country") === "FR") return "fr";

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const first = acceptLanguage.split(",")[0]?.trim().toLowerCase() ?? "";
  if (first.startsWith("fr")) return "fr";

  return "en";
}

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NS_LOCALE_HEADER, detectLocale(request));

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  /* Pages uniquement : ni l'API, ni les assets Next, ni les fichiers publics,
     ni le relais PostHog (/nsr). */
  matcher: ["/((?!api|nsr|_next/static|_next/image|.*\\..*).*)"],
};
