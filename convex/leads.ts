import { v } from "convex/values";
import { internalMutation, internalQuery, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Le formulaire de la landing des pubs, en deux temps. Les deux mutations sont
 * publiques parce qu'elles sont appelees depuis la route Next `/api/lead` avec
 * le client HTTP, qui n'atteint pas les fonctions internes ; le secret partage
 * (le meme que pour les visites) evite qu'un tiers vienne remplir la table.
 *
 * Premier temps : prenom, telephone, e-mail. Le lead existe des cet instant,
 * meme s'il ne va pas plus loin : on peut l'appeler.
 * Second temps : les questions. C'est la qu'on dit a Meta « Lead ».
 * Reservation : le webhook Cal.com retrouve le lead par son e-mail.
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

/* L'identifiant d'evenement partage entre le pixel du navigateur et l'API
   Conversions : Meta ne compte qu'un Lead des deux. */
function idEvenement(leadId: string): string {
  return `lead-${leadId}`;
}

export const contact = mutation({
  args: {
    secret: v.string(),
    visiteId: v.optional(v.string()),
    prenom: v.string(),
    nom: v.optional(v.string()),
    telephone: v.string(),
    email: v.string(),
    jeton: v.string(),
  },
  returns: v.id("leads"),
  handler: async (ctx, args) => {
    verifierSecret(args.secret);
    const email = args.email.trim().toLowerCase();

    /* Retour en arriere ou rechargement : la meme personne qui renvoie le
       premier temps garde sa ligne, sans nouvelle alerte. */
    const dernier = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .order("desc")
      .first();
    if (dernier && dernier.statut === "partiel") {
      await ctx.db.patch("leads", dernier._id, {
        prenom: args.prenom,
        nom: args.nom,
        telephone: args.telephone,
        jeton: args.jeton,
        ...(args.visiteId ? { visiteId: args.visiteId } : {}),
      });
      return dernier._id;
    }

    const leadId = await ctx.db.insert("leads", {
      visiteId: args.visiteId,
      prenom: args.prenom,
      nom: args.nom,
      telephone: args.telephone,
      email,
      jeton: args.jeton,
      statut: "partiel",
    });
    await ctx.scheduler.runAfter(0, internal.notifications.lead, {
      leadId,
      moment: "contact",
    });
    return leadId;
  },
});

/**
 * Renvoie l'identifiant d'evenement a utiliser pour le Lead du navigateur, ou
 * null si le lead est inconnu ou si le jeton ne correspond pas.
 */
export const reponses = mutation({
  args: {
    secret: v.string(),
    leadId: v.id("leads"),
    jeton: v.string(),
    sourcesChantiers: v.array(v.string()),
    chiffreAffaires: v.string(),
    delai: v.string(),
    role: v.string(),
    siteWeb: v.optional(v.string()),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    verifierSecret(args.secret);
    const lead = await ctx.db.get("leads", args.leadId);
    if (!lead || lead.jeton !== args.jeton) return null;

    /* Un second envoi des reponses ne repart ni vers Meta ni vers Slack. */
    if (lead.statut !== "partiel") return idEvenement(lead._id);

    await ctx.db.patch("leads", lead._id, {
      sourcesChantiers: args.sourcesChantiers,
      chiffreAffaires: args.chiffreAffaires,
      delai: args.delai,
      role: args.role,
      siteWeb: args.siteWeb,
      statut: "complet",
    });
    await ctx.scheduler.runAfter(0, internal.meta.lead, { leadId: lead._id });
    await ctx.scheduler.runAfter(0, internal.notifications.lead, {
      leadId: lead._id,
      moment: "complet",
    });
    return idEvenement(lead._id);
  },
});

/**
 * Appelee par le webhook Cal.com quand un rendez-vous est cree : le lead le
 * plus recent avec cet e-mail passe en « reserve ». Sans lead (reservation
 * faite sans passer par le formulaire), ne fait rien.
 */
export const marquerReserve = internalMutation({
  args: {
    email: v.optional(v.string()),
    calUid: v.string(),
    debut: v.optional(v.string()),
  },
  /* Le lead retrouve (prenom et telephone), pour demarrer la sequence de
     messages ; null si la reservation ne vient pas du formulaire. */
  returns: v.union(
    v.object({ prenom: v.string(), telephone: v.string() }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const email = args.email?.trim().toLowerCase();
    if (!email) return null;
    const lead = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .order("desc")
      .first();
    if (!lead) return null;
    const retour = { prenom: lead.prenom, telephone: lead.telephone };
    /* Webhook rejoue : le lead est deja marque, on rend les memes donnees sans
       renvoyer l'alerte. */
    if (lead.calUid === args.calUid) return retour;

    await ctx.db.patch("leads", lead._id, { statut: "reserve", calUid: args.calUid });
    await ctx.scheduler.runAfter(0, internal.notifications.lead, {
      leadId: lead._id,
      moment: "reserve",
      debut: args.debut,
    });
    return retour;
  },
});

/* Pour les actions (Meta, Slack), qui n'ont pas acces a la base. */
export const parId = internalQuery({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    return await ctx.db.get("leads", leadId);
  },
});
