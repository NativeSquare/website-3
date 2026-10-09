import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import {
  idEvenementLead,
  parametresLead,
  parametresSchedule,
} from "../src/lib/lead-meta";

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

/* Le telephone se hache comme le reste : chiffres seulement, indicatif compris.
   Un numero americain a dix chiffres recoit le 1 devant. */
async function hacherTelephone(valeur: string | undefined): Promise<string[] | undefined> {
  const chiffres = (valeur ?? "").replace(/\D/g, "");
  if (!chiffres) return undefined;
  return [await hacher(chiffres.length === 10 ? `1${chiffres}` : chiffres)];
}

/* Le domaine americain : c'est lui que Meta doit voir comme source des
   evenements. Le chemin vient de la visite. */
const ORIGINE_SITE = "https://nativesquare.ai";

type EvenementMeta = {
  event_name: string;
  event_id: string;
  event_source_url: string;
  user_data: Record<string, unknown>;
  custom_data?: Record<string, unknown>;
};

/**
 * Envoie un evenement a l'API Conversions. Sans identifiant de pixel ni token
 * dans l'environnement Convex, on ne fait rien et on le dit dans les logs : le
 * site ne depend jamais de Meta.
 */
async function envoyerEvenement(evenement: EvenementMeta): Promise<void> {
  const pixel = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_TOKEN;
  if (!pixel || !token) {
    console.log(`[meta] META_PIXEL_ID ou META_CAPI_TOKEN absent : ${evenement.event_name} non envoye`);
    return;
  }

  for (const cle of Object.keys(evenement.user_data)) {
    if (evenement.user_data[cle] === undefined) delete evenement.user_data[cle];
  }

  const corps: Record<string, unknown> = {
    data: [
      {
        ...evenement,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
      },
    ],
    access_token: token,
  };
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
    console.error(`[meta] ${evenement.event_name} refuse`, reponse.status, texte.slice(0, 500));
    return;
  }
  console.log(`[meta] ${evenement.event_name} envoye`, evenement.event_id, texte.slice(0, 200));
}

/**
 * Un lead qui a laisse ses coordonnees (apres les deux questions faciles) :
 * l'evenement standard « Lead ». Meme identifiant d'evenement que le pixel du
 * navigateur (`lead-<id>`), donc Meta n'en compte qu'un.
 */
export const lead = internalAction({
  args: { leadId: v.id("leads") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const lead = await ctx.runQuery(internal.leads.parId, { leadId: args.leadId });
    if (!lead) return null;
    const visite = lead.visiteId
      ? await ctx.runQuery(internal.visites.parVisiteId, { visiteId: lead.visiteId })
      : null;

    /* Quand la zone donnee est un code postal americain, il aide Meta a
       reconnaitre la personne. Une ville en toutes lettres ne s'envoie pas. */
    const codePostal = lead.zone?.match(/\b\d{5}\b/)?.[0];

    await envoyerEvenement({
      event_name: "Lead",
      event_id: idEvenementLead(lead._id),
      event_source_url: ORIGINE_SITE + (visite?.chemin ?? "/hvac"),
      user_data: {
        em: await hacherSi(lead.email),
        ph: await hacherTelephone(lead.telephone),
        fn: await hacherSi(lead.prenom),
        ln: await hacherSi(lead.nom),
        zp: await hacherSi(codePostal),
        external_id: await hacherSi(visite?.visiteurId),
        country: await hacherSi(visite?.pays),
        fbp: visite?.fbp,
        fbc: visite?.fbc,
        client_user_agent: visite?.agent,
      },
      custom_data: parametresLead(lead.capacite),
    });
    return null;
  },
});

/**
 * Un rendez-vous reserve : l'evenement standard « Schedule ». Identifiant
 * d'evenement = l'uid Cal.com, donc un webhook rejoue ne compte pas deux fois.
 * Le role et le chiffre d'affaires viennent du lead du formulaire : ce sont les
 * memes valeurs que le navigateur envoie avec son propre Schedule.
 */
export const schedule = internalAction({
  args: {
    calUid: v.string(),
    visiteId: v.optional(v.string()),
    email: v.optional(v.string()),
    nom: v.optional(v.string()),
    role: v.optional(v.string()),
    revenue: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const visite = args.visiteId
      ? await ctx.runQuery(internal.visites.parVisiteId, { visiteId: args.visiteId })
      : null;

    const morceaux = (args.nom ?? "").trim().split(/\s+/).filter(Boolean);
    const prenom = morceaux[0];
    const nomFamille = morceaux.length > 1 ? morceaux[morceaux.length - 1] : undefined;

    await envoyerEvenement({
      event_name: "Schedule",
      event_id: `cal-${args.calUid}`,
      event_source_url: ORIGINE_SITE + (visite?.chemin ?? "/"),
      user_data: {
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
      },
      custom_data: parametresSchedule(args.role, args.revenue),
    });
    return null;
  },
});
