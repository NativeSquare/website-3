import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import { accesRequete } from "../../../../lib/interne";

/* Un clic sur une fiche ecrit le statut dans Quo, et c'est tout : la page se
   relit depuis Quo, le booker aussi. Une action, un endroit. */
const STATUTS = ["À appeler", "Répondeur", "Rappeler", "Refus", "Booké", "Pas le patron"];

export async function POST(requete: Request) {
  if (!(await accesRequete(requete))) {
    return NextResponse.json({ erreur: "acces refuse" }, { status: 401 });
  }
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.MOTEUR_SECRET;
  if (!convexUrl || !secret) {
    return NextResponse.json({ erreur: "configuration incomplete" }, { status: 500 });
  }
  const c = (await requete.json()) as { id?: string; statut?: string; prenom?: string; note?: string };
  if (!c.id || !c.statut || !STATUTS.includes(c.statut)) {
    return NextResponse.json({ erreur: "id ou statut invalide" }, { status: 400 });
  }
  try {
    const convex = new ConvexHttpClient(convexUrl);
    const contact = await convex.action(api.quo.statut, {
      secret,
      id: c.id,
      statut: c.statut,
      prenom: c.prenom?.trim() || undefined,
      note: c.note?.trim() || undefined,
    });
    return NextResponse.json({ contact });
  } catch (e) {
    return NextResponse.json({ erreur: "Quo", detail: String(e).slice(0, 400) }, { status: 502 });
  }
}
