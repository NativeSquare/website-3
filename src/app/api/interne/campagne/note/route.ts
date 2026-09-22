import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import { accesRequete } from "../../../../lib/interne";

/* Une note tapee sur une fiche part dans Quo, devant les anciennes. */
export async function POST(requete: Request) {
  if (!(await accesRequete(requete))) {
    return NextResponse.json({ erreur: "acces refuse" }, { status: 401 });
  }
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.MOTEUR_SECRET;
  if (!convexUrl || !secret) {
    return NextResponse.json({ erreur: "configuration incomplete" }, { status: 500 });
  }
  const c = (await requete.json()) as { id?: string; note?: string };
  const note = c.note?.trim() ?? "";
  if (!c.id || !note) {
    return NextResponse.json({ erreur: "id ou note manquant" }, { status: 400 });
  }
  try {
    const convex = new ConvexHttpClient(convexUrl);
    const contact = await convex.action(api.quo.noter, { secret, id: c.id, note });
    return NextResponse.json({ contact });
  } catch (e) {
    return NextResponse.json({ erreur: "Quo", detail: String(e).slice(0, 400) }, { status: 502 });
  }
}
