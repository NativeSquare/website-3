import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * La mutation est publique parce qu'elle est appelee depuis la route Next
 * `/api/visite` avec le client HTTP, qui ne sait pas atteindre les fonctions
 * internes. Le secret partage evite qu'un tiers vienne remplir la table.
 */
function verifierSecret(secret: string) {
  const attendu = process.env.MOTEUR_SECRET;
  if (!attendu) {
    throw new Error("MOTEUR_SECRET absent de l'environnement Convex");
  }
  if (secret !== attendu) {
    throw new Error("secret invalide");
  }
}

/* La visite est portee dans son propre objet pour que le secret ne se melange
   jamais a ce qui part en base. */
const visite = v.object({
  visiteId: v.string(),
  visiteurId: v.string(),
  chemin: v.string(),
  referent: v.optional(v.string()),
  pays: v.optional(v.string()),
  compteNom: v.optional(v.string()),
  campagneId: v.optional(v.string()),
  campagneNom: v.optional(v.string()),
  groupeId: v.optional(v.string()),
  groupeNom: v.optional(v.string()),
  creaId: v.optional(v.string()),
  utmSource: v.optional(v.string()),
  utmMedium: v.optional(v.string()),
  utmCampaign: v.optional(v.string()),
  utmContent: v.optional(v.string()),
  utmTerm: v.optional(v.string()),
  parametres: v.optional(v.record(v.string(), v.string())),
  fbp: v.optional(v.string()),
  fbc: v.optional(v.string()),
  agent: v.optional(v.string()),
});

export const enregistrer = mutation({
  args: { secret: v.string(), visite },
  returns: v.null(),
  handler: async (ctx, args) => {
    verifierSecret(args.secret);

    /* Le site peut rejouer l'appel (navigation, rechargement) : une visite
       reste une ligne. */
    const existante = await ctx.db
      .query("visites")
      .withIndex("by_visiteId", (q) => q.eq("visiteId", args.visite.visiteId))
      .unique();
    if (existante) {
      return null;
    }

    await ctx.db.insert("visites", args.visite);
    return null;
  },
});

/**
 * Le pixel Meta pose ses cookies quelques instants apres la page ; la route
 * `/api/visite/meta` les accroche ici a la visite en cours. Une visite
 * inconnue est ignoree sans bruit.
 */
export const attacherMeta = mutation({
  args: {
    secret: v.string(),
    visiteId: v.string(),
    fbp: v.optional(v.string()),
    fbc: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    verifierSecret(args.secret);
    const existante = await ctx.db
      .query("visites")
      .withIndex("by_visiteId", (q) => q.eq("visiteId", args.visiteId))
      .unique();
    if (!existante) return null;

    const patch: { fbp?: string; fbc?: string } = {};
    if (args.fbp && !existante.fbp) patch.fbp = args.fbp;
    if (args.fbc && !existante.fbc) patch.fbc = args.fbc;
    if (Object.keys(patch).length) await ctx.db.patch(existante._id, patch);
    return null;
  },
});

/* Pour l'API Conversions (convex/meta.ts) : la visite d'ou vient un rendez-vous. */
export const parVisiteId = internalQuery({
  args: { visiteId: v.string() },
  handler: async (ctx, { visiteId }) => {
    return await ctx.db
      .query("visites")
      .withIndex("by_visiteId", (q) => q.eq("visiteId", visiteId))
      .unique();
  },
});

/**
 * Les dernieres visites, pour un coup d'oeil rapide depuis le tableau de bord
 * ou un futur ecran interne.
 */
export const dernieres = query({
  args: { limite: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("visites")
      .order("desc")
      .take(args.limite ?? 100);
  },
});
