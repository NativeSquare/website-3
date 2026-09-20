import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { accesRequete } from "../../../lib/interne";

/* Les contacts de la campagne, lus dans Quo par l'action Convex qui detient
   la cle. La page ne voit jamais la cle, seulement le resultat. */
export async function GET(requete: Request) {
  if (!(await accesRequete(requete))) {
    return NextResponse.json({ erreur: "acces refuse" }, { status: 401 });
  }
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.MOTEUR_SECRET;
  if (!convexUrl || !secret) {
    return NextResponse.json({ erreur: "configuration incomplete" }, { status: 500 });
  }
  try {
    const convex = new ConvexHttpClient(convexUrl);
    const resultat = await convex.action(api.quo.liste, { secret });
    return NextResponse.json(resultat);
  } catch (e) {
    return NextResponse.json({ erreur: "Quo", detail: String(e).slice(0, 400) }, { status: 502 });
  }
}
