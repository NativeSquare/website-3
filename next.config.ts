import type { NextConfig } from "next";

/* PostHog passe par notre propre domaine. Servi depuis son domaine a lui, le
   script se fait bloquer par les bloqueurs de pub, tres repandus chez les
   dirigeants sur ordinateur de bureau — c'est-a-dire exactement notre cible.
   Le chemin est volontairement opaque : les bloqueurs interceptent /analytics
   et /posthog. Doc : https://posthog.com/docs/advanced/proxy/nextjs */
const RELAIS = "/nsr";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: `${RELAIS}/static/:path*`,
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: `${RELAIS}/array/:path*`,
        destination: "https://eu-assets.i.posthog.com/array/:path*",
      },
      {
        source: `${RELAIS}/:path*`,
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },
  /* Exige par le relais : sans ca, Next ajoute une redirection qui casse
     l'ingestion. */
  skipTrailingSlashRedirect: true,
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
  },
};

export default nextConfig;
