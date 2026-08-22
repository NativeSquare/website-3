import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { LinkedInInsightTag } from "./components/LinkedInInsightTag";
import { SuiviVisite } from "./components/SuiviVisite";
import { Analytique } from "./components/Analytique";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-title",
  subsets: ["latin"],
  weight: ["500"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "NativeSquare | Healthcare Startup Studio",
  description:
    "We build health platforms and partner with health tech visionaries. Home of Cadence, the AI running coach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${plusJakarta.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
        <LinkedInInsightTag />
        <Analytique />
        <SuiviVisite />
      </body>
    </html>
  );
}
