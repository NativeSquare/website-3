import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { accesRequete } from "../../../lib/interne";

/* La page d'appels : les listes, les prospects d'une liste, et un clic de statut
   ou une note. Tout est lu et écrit dans Convex ; la page ne voit jamais le
   secret, seulement le résultat. */

const STATUTS = ["a_appeler", "pas_de_reponse", "repondeur", "pas_patron", "rappeler", "refus", "booke"] as const;
type Statut = (typeof STATUTS)[number];

function client() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.MOTEUR_SECRET;
  if (!convexUrl || !secret) return null;
  return { convex: new ConvexHttpClient(convexUrl), secret };
}

const refuse = () => NextResponse.json({ erreur: "acces refuse" }, { status: 401 });
const incomplet = () => NextResponse.json({ erreur: "configuration incomplete" }, { status: 500 });

/* Sans paramètre : synchronise les rappels puis rend les listes. Avec ?liste= : les prospects de cette liste. */
export async function GET(requete: Request) {
  if (!(await accesRequete(requete))) return refuse();
  const c = client();
  if (!c) return incomplet();
  const liste = new URL(requete.url).searchParams.get("liste");
  try {
    if (liste) {
      const prospects = await c.convex.query(api.appels.prospects, { secret: c.secret, liste });
      return NextResponse.json({ prospects });
    }
    const synchro = await c.convex.mutation(api.appels.synchroRappels, { secret: c.secret });
    const listes = await c.convex.query(api.appels.listes, { secret: c.secret });
    return NextResponse.json({ listes, synchro });
  } catch (e) {
    return NextResponse.json({ erreur: "Convex", detail: String(e).slice(0, 400) }, { status: 502 });
  }
}

export async function POST(requete: Request) {
  if (!(await accesRequete(requete))) return refuse();
  const c = client();
  if (!c) return incomplet();
  const b = (await requete.json()) as {
    id?: string;
    statut?: string;
    notes?: string;
    rappelLe?: string;
    prenom?: string;
  };
  if (!b.id) return NextResponse.json({ erreur: "id manquant" }, { status: 400 });
  if (b.statut && !STATUTS.includes(b.statut as Statut)) {
    return NextResponse.json({ erreur: "statut invalide" }, { status: 400 });
  }
  if (b.rappelLe && !/^\d{4}-\d{2}-\d{2}$/.test(b.rappelLe)) {
    return NextResponse.json({ erreur: "date invalide" }, { status: 400 });
  }
  try {
    const prospect = await c.convex.mutation(api.appels.maj, {
      secret: c.secret,
      id: b.id as Id<"prospectsAppel">,
      statut: b.statut as Statut | undefined,
      notes: b.notes,
      rappelLe: b.rappelLe,
      prenom: b.prenom,
    });
    return NextResponse.json({ prospect });
  } catch (e) {
    return NextResponse.json({ erreur: "Convex", detail: String(e).slice(0, 400) }, { status: 502 });
  }
}
