import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { LinkedInInsightTag } from "./components/LinkedInInsightTag";
import { SuiviVisite } from "./components/SuiviVisite";
import { Analytique } from "./components/Analytique";

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

  return (
    <html lang={locale} className={`${figtree.variable} ${inter.variable}`}>
      <body className="antialiased">
        {children}
        <LinkedInInsightTag />
        <Analytique />
        <SuiviVisite />
      </body>
    </html>
  );
}
