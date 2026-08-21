import { mutation, query } from "./_generated/server";
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
