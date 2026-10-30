import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

/* Les pages qui previennent la base quand un lead les ouvre. */
const PAGES = ["guide", "reservation", "video", "cas_roofing", "cas_septic"] as const;
type Page = (typeof PAGES)[number];

/**
 * Une page ouverte depuis un lien de la sequence : le guide, la page de
 * reservation, la page pre-appel ou l'un des one-pagers, avec
 * `?r=<identifiant du lead>` dans l'adresse. Le navigateur parle a cette route,
 * pas a Convex : le secret partage reste cote serveur, comme pour `/api/lead` et
 * `/api/visite`. Une base qui ne repond pas ne gene jamais la page.
 */
export async function POST(requete: Request) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.MOTEUR_SECRET;
  if (!url || !secret) return NextResponse.json({ ok: false });

  let corps: { r?: unknown; page?: unknown };
  try {
    corps = (await requete.json()) as { r?: unknown; page?: unknown };
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const r = typeof corps.r === "string" ? corps.r.trim().slice(0, 64) : "";
  const page: Page | null = PAGES.find((p) => p === corps.page) ?? null;
  if (!r || !page) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    await new ConvexHttpClient(url).mutation(api.relance.vue, { secret, r, page });
    return NextResponse.json({ ok: true });
  } catch (erreur) {
    console.error("[relance] vue non enregistree", erreur);
    return NextResponse.json({ ok: false });
  }
}
