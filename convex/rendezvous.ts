import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Cree par le webhook Cal.com, jamais par le site. Interne, donc inatteignable
 * depuis l'exterieur : seule l'action HTTP signee peut l'appeler.
 */
export const creer = internalMutation({
  args: {
    visiteId: v.optional(v.string()),
    calUid: v.string(),
    titre: v.optional(v.string()),
    nom: v.optional(v.string()),
    email: v.optional(v.string()),
    debut: v.optional(v.string()),
    statut: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    /* Cal.com peut rejouer un webhook. */
    const existant = await ctx.db
      .query("rendezvous")
      .withIndex("by_calUid", (q) => q.eq("calUid", args.calUid))
      .unique();
    if (existant) {
      await ctx.db.patch(existant._id, args);
      return null;
    }
    await ctx.db.insert("rendezvous", args);
    return null;
  },
});

export const tous = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("rendezvous").order("desc").take(200);
  },
});
