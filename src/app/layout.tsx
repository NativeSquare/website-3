import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { LinkedInInsightTag } from "./components/LinkedInInsightTag";
import { SuiviVisite } from "./components/SuiviVisite";
import { Analytique } from "./components/Analytique";
import { MetaPixel } from "./components/MetaPixel";
import { GoogleTag } from "./components/GoogleTag";

/* Aeonik substitute — closest free match for the search-party DA. */
const figtree = Figtree({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "NativeSquare — AI systems for service businesses",
  description:
    "Speed-to-lead calling, automatic follow-ups, AI receptionists and custom tools, wired into what you already use.",
  /* Vérification des domaines dans le portefeuille Meta (Brand safety → Domains).
     Un code par domaine, rendu en <meta name="facebook-domain-verification"> :
     nativesquare.fr (26/09/2026) puis nativesquare.ai (07/10/2026). Le site est
     le même pour les deux domaines, les deux balises sont donc servies partout. */
  verification: {
    other: {
      "facebook-domain-verification": [
        "n0s1590h1oerzyfsib8ndbc1dsu9rc",
        "whi8x6e0lcg1hsexlcmhh8ulpoxfmf",
      ],
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* Langue négociée par src/middleware.ts (FR si visiteur associable à la
     France, EN sinon) — même URL, contenu négocié. */
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-ns-locale") === "fr" ? "fr" : "en";

  /* Aucun tag tiers en local (next dev) : un test sur localhost ne doit rien
     envoyer a LinkedIn, PostHog, Meta ni Google. En production NODE_ENV vaut
     « production » : rien ne change. */
  const suivi = process.env.NODE_ENV === "production";

  return (
    <html lang={locale} className={`${figtree.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
        {suivi && <LinkedInInsightTag />}
        {suivi && <Analytique />}
        <SuiviVisite />
        {/* Pages anglaises seulement : le trafic des pubs US, pas les
            visiteurs francais. */}
        <MetaPixel actif={suivi && locale === "en"} />
        <GoogleTag actif={suivi && locale === "en"} />
      </body>
    </html>
  );
}
