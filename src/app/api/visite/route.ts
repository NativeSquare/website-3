import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

/**
 * La capture des visites passe par notre propre domaine, pas par un script
 * tiers : c'est ce qui la rend insensible aux bloqueurs. L'Insight Tag
 * LinkedIn reste monte a cote, mais il sert a LinkedIn, pas a nous.
 *
 * Doctrine : atlas/agence/acquisition/moteur-de-mesure.md
 */

const COOKIE_VISITEUR = "ns_visiteur";
const COOKIE_VISITE = "ns_visite";
const UN_AN = 60 * 60 * 24 * 365;
const QUATRE_VINGT_DIX_JOURS = 60 * 60 * 24 * 90;

/* Les parametres dynamiques poses sur l'URL de destination dans Campaign
   Manager. Doc : https://www.linkedin.com/help/lms/answer/a5968064 */
const CHAMPS_LINKEDIN: Record<string, string> = {
  li_compte: "compteNom",
  li_campagne_id: "campagneId",
  li_campagne: "campagneNom",
  li_groupe_id: "groupeId",
  li_groupe: "groupeNom",
  li_crea: "creaId",
};

const CHAMPS_UTM: Record<string, string> = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
};

/* Une valeur non substituee ne veut rien dire : LinkedIn laisse les accolades
   quand le parametre n'existe pas pour ce type de campagne. */
function propre(valeur: string | undefined) {
  if (!valeur) return undefined;
  const v = valeur.trim();
  if (!v || (v.startsWith("{{") && v.endsWith("}}"))) return undefined;
  return v.slice(0, 500);
}

export async function POST(requete: Request) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.MOTEUR_SECRET;
  if (!url || !secret) {
    /* Sans base branchee, on ne casse pas le site : on ne mesure rien. */
    return NextResponse.json({ mesure: false });
  }

  const corps = (await requete.json()) as {
    chemin?: string;
    referent?: string;
    parametres?: Record<string, string>;
  };

  const boite = await cookies();
  const enTetes = await headers();

  const visiteurId = boite.get(COOKIE_VISITEUR)?.value ?? crypto.randomUUID();

  const params = corps.parametres ?? {};
  const vientDUneCampagne =
    Object.keys(CHAMPS_LINKEDIN).some((c) => propre(params[c])) ||
    Object.keys(CHAMPS_UTM).some((c) => propre(params[c]));

  /* Une nouvelle visite a chaque arrivee depuis une pub. Une navigation
     ordinaire garde la visite en cours. */
  const visiteExistante = boite.get(COOKIE_VISITE)?.value;
  const visiteId =
    vientDUneCampagne || !visiteExistante ? crypto.randomUUID() : visiteExistante;

  const attribution: Record<string, string> = {};
  for (const [parametre, champ] of Object.entries({
    ...CHAMPS_LINKEDIN,
    ...CHAMPS_UTM,
  })) {
    const valeur = propre(params[parametre]);
    if (valeur) attribution[champ] = valeur;
  }

  /* Le reste de la chaine de requete, garde brut : on ne sait pas encore ce
     qu'on voudra lire dans six mois. */
  const connus = new Set([
    ...Object.keys(CHAMPS_LINKEDIN),
    ...Object.keys(CHAMPS_UTM),
  ]);
  const parametres: Record<string, string> = {};
  for (const [cle, valeur] of Object.entries(params)) {
    const v = propre(valeur);
    if (v && !connus.has(cle)) parametres[cle.slice(0, 60)] = v;
  }

  try {
    await new ConvexHttpClient(url).mutation(api.visites.enregistrer, {
      secret,
      visite: {
        visiteId,
        visiteurId,
        chemin: (corps.chemin ?? "/").slice(0, 500),
        referent: propre(corps.referent),
        pays: enTetes.get("x-vercel-ip-country") ?? undefined,
        ...attribution,
        ...(Object.keys(parametres).length ? { parametres } : {}),
      },
    });
  } catch (erreur) {
    console.error("[visite] ecriture impossible", erreur);
    return NextResponse.json({ mesure: false }, { status: 200 });
  }

  const reponse = NextResponse.json({ mesure: true, visiteId });
  const commun = { path: "/", sameSite: "lax" as const, secure: true };
  /* Lisible par le navigateur : BookingLink doit pouvoir l'accrocher a l'URL
     Cal.com au moment du clic. */
  reponse.cookies.set(COOKIE_VISITEUR, visiteurId, { ...commun, maxAge: UN_AN });
  reponse.cookies.set(COOKIE_VISITE, visiteId, {
    ...commun,
    maxAge: QUATRE_VINGT_DIX_JOURS,
  });
  return reponse;
}
