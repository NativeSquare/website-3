import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * L'API Conversions de Meta : les evenements que le navigateur ne peut pas
 * voir. La reservation se fait chez Cal.com, sur un autre domaine ; seul le
 * webhook la connait. On l'envoie donc d'ici, cote serveur, avec ce que la
 * visite a laisse (cookies _fbp/_fbc, pays, identifiant durable) pour que Meta
 * recolle la reservation a la personne qui a clique sur la pub.
 *
 * Doc : https://developers.facebook.com/docs/marketing-api/conversions-api/get-started/
 * Parametres : https://developers.facebook.com/docs/marketing-api/conversions-api/parameters
 *
 * Plan : atlas/agence/mentorat-angelo/ads/plan-meta-ads.md, etape 2.
 */

const VERSION_API = "v22.0";

/* Meta attend les identifiants personnels normalises (minuscules, sans
   espaces) puis passes en SHA-256 hexadecimal. */
async function hacher(valeur: string): Promise<string> {
  const brut = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(valeur),
  );
  return Array.from(new Uint8Array(brut))
    .map((o) => o.toString(16).padStart(2, "0"))
    .join("");
}

function propre(valeur: string | undefined): string | undefined {
  const v = valeur?.trim().toLowerCase();
  return v || undefined;
}

async function hacherSi(valeur: string | undefined): Promise<string[] | undefined> {
  const v = propre(valeur);
  return v ? [await hacher(v)] : undefined;
}

/**
 * Un rendez-vous reserve : l'evenement standard « Schedule ». Identifiant
 * d'evenement = l'uid Cal.com, donc un webhook rejoue ne compte pas deux fois.
 * Sans identifiant de pixel ni token dans l'environnement Convex, on ne fait
 * rien et on le dit dans les logs : le site ne depend jamais de Meta.
 */
export const schedule = internalAction({
  args: {
    calUid: v.string(),
    visiteId: v.optional(v.string()),
    email: v.optional(v.string()),
    nom: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const pixel = process.env.META_PIXEL_ID;
    const token = process.env.META_CAPI_TOKEN;
    if (!pixel || !token) {
      console.log("[meta] META_PIXEL_ID ou META_CAPI_TOKEN absent : Schedule non envoye");
      return null;
    }

    const visite = args.visiteId
      ? await ctx.runQuery(internal.visites.parVisiteId, { visiteId: args.visiteId })
      : null;

    const morceaux = (args.nom ?? "").trim().split(/\s+/).filter(Boolean);
    const prenom = morceaux[0];
    const nomFamille = morceaux.length > 1 ? morceaux[morceaux.length - 1] : undefined;

    const user_data: Record<string, unknown> = {
      em: await hacherSi(args.email),
      fn: await hacherSi(prenom),
      ln: await hacherSi(nomFamille),
      /* L'identifiant durable du navigateur, le meme que le pixel envoie en
         external_id a l'initialisation. */
      external_id: await hacherSi(visite?.visiteurId),
      country: await hacherSi(visite?.pays),
      fbp: visite?.fbp,
      fbc: visite?.fbc,
      client_user_agent: visite?.agent,
    };
    for (const cle of Object.keys(user_data)) {
      if (user_data[cle] === undefined) delete user_data[cle];
    }

    const evenement = {
      event_name: "Schedule",
      event_time: Math.floor(Date.now() / 1000),
      event_id: `cal-${args.calUid}`,
      action_source: "website",
      event_source_url: "https://nativesquare.fr" + (visite?.chemin ?? "/"),
      user_data,
      custom_data: { content_name: "discovery-call" },
    };

    const corps: Record<string, unknown> = { data: [evenement], access_token: token };
    /* Le code de test du Gestionnaire d'evenements (onglet « Tester les
       evenements ») : pose dans l'environnement le temps de verifier, retire
       ensuite, sinon les evenements ne comptent pas. */
    if (process.env.META_TEST_EVENT_CODE) {
      corps.test_event_code = process.env.META_TEST_EVENT_CODE;
    }

    const reponse = await fetch(
      `https://graph.facebook.com/${VERSION_API}/${pixel}/events`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      },
    );
    const texte = await reponse.text();
    if (!reponse.ok) {
      console.error("[meta] Schedule refuse", reponse.status, texte.slice(0, 500));
      return null;
    }
    console.log("[meta] Schedule envoye", args.calUid, texte.slice(0, 200));
    return null;
  },
});
