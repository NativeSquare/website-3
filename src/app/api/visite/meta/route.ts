import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

/**
 * Le pixel Meta accroche ses cookies (_fbp, _fbc) a la visite en cours. C'est
 * ce qui permet, plus tard, d'envoyer la reservation Cal.com a Meta avec
 * assez d'indices pour qu'il la relie au clic sur la pub.
 */

const COOKIE_VISITE = "ns_visite";

function valide(valeur: unknown): string | undefined {
  if (typeof valeur !== "string") return undefined;
  const v = valeur.trim();
  /* Les deux cookies de Meta commencent par « fb. » ; on ne stocke rien
     d'autre. */
  return v.startsWith("fb.") && v.length <= 200 ? v : undefined;
}

export async function POST(requete: Request) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.MOTEUR_SECRET;
  const visiteId = (await cookies()).get(COOKIE_VISITE)?.value;
  if (!url || !secret || !visiteId) {
    return NextResponse.json({ mesure: false });
  }

  const corps = (await requete.json().catch(() => ({}))) as {
    fbp?: unknown;
    fbc?: unknown;
  };
  const fbp = valide(corps.fbp);
  const fbc = valide(corps.fbc);
  if (!fbp && !fbc) {
    return NextResponse.json({ mesure: false });
  }

  try {
    await new ConvexHttpClient(url).mutation(api.visites.attacherMeta, {
      secret,
      visiteId,
      fbp,
      fbc,
    });
  } catch (erreur) {
    console.error("[visite/meta] ecriture impossible", erreur);
    return NextResponse.json({ mesure: false });
  }
  return NextResponse.json({ mesure: true });
}
