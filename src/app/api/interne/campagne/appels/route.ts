import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import { accesRequete } from "../../../../lib/interne";

/* L'historique d'appels des numeros de la campagne. Une requete Quo par
   numero, donc lent : la page l'appelle apres avoir affiche les fiches. */
export async function POST(requete: Request) {
  if (!(await accesRequete(requete))) {
    return NextResponse.json({ erreur: "acces refuse" }, { status: 401 });
  }
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.MOTEUR_SECRET;
  if (!convexUrl || !secret) {
    return NextResponse.json({ erreur: "configuration incomplete" }, { status: 500 });
  }
  const corps = (await requete.json()) as { numeros?: string[] };
  const numeros = (corps.numeros ?? []).filter((n) => typeof n === "string").slice(0, 200);
  try {
    const convex = new ConvexHttpClient(convexUrl);
    const resultat = await convex.action(api.quo.appels, { secret, numeros });
    return NextResponse.json({ appels: resultat });
  } catch (e) {
    return NextResponse.json({ erreur: "Quo", detail: String(e).slice(0, 400) }, { status: 502 });
  }
}
