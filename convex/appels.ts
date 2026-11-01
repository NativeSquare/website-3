import { mutation, query } from "./_generated/server";
import type { QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { v } from "convex/values";

/* La page d'appels (`/interne/appels`). Les listes de cold calling et les
   leads à rappeler vivent ici, pas dans Quo : une liste est une session, un
   clic sur un statut s'écrit tout de suite. Les fonctions sont appelées par la
   route /api/interne/appels, qui passe le secret partagé (même principe que
   quo.ts). */

function verifier(secret: string) {
  if (secret !== process.env.MOTEUR_SECRET) throw new Error("secret invalide");
}

const STATUT = v.union(
  v.literal("a_appeler"),
  v.literal("pas_de_reponse"),
  v.literal("repondeur"),
  v.literal("pas_patron"),
  v.literal("rappeler"),
  v.literal("refus"),
  v.literal("booke"),
);

type Statut = Doc<"prospectsAppel">["statut"];
type Ligne = Doc<"prospectsAppel"> & { statutJour: Statut; hier?: Statut };

/* Le jour d'Alexandre : la date à Paris, sans dépendre d'Intl (heure d'été
   européenne : du dernier dimanche de mars au dernier dimanche d'octobre). */
function dernierDimanche(annee: number, mois: number): number {
  const d = new Date(Date.UTC(annee, mois + 1, 0, 1, 0, 0));
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d.getTime();
}
function jourParis(ts: number): string {
  const annee = new Date(ts).getUTCFullYear();
  const decalage = ts >= dernierDimanche(annee, 2) && ts < dernierDimanche(annee, 9) ? 2 : 1;
  return new Date(ts + decalage * 3600_000).toISOString().slice(0, 10);
}

const SORTIS: Statut[] = ["refus", "booke"];

/* Les rappels du jour : les leads qui ont laissé leurs coordonnées sans réserver,
   plus les prospects froids marqués « à rappeler » dont le jour est arrivé. Un
   lead se rappelle tous les jours jusqu'à ce qu'il réserve ou refuse : son
   statut redevient « à appeler » chaque matin, avec celui de la veille en repère. */
async function lignesRappels(ctx: QueryCtx): Promise<Ligne[]> {
  const aujourdhui = jourParis(Date.now());
  const leads = await ctx.db
    .query("prospectsAppel")
    .withIndex("by_liste", (q) => q.eq("liste", "rappels"))
    .collect();
  const dus = (
    await ctx.db
      .query("prospectsAppel")
      .withIndex("by_statut", (q) => q.eq("statut", "rappeler"))
      .collect()
  ).filter((r) => r.liste !== "rappels" && r.rappelLe && r.rappelLe <= aujourdhui);

  const lignes: Ligne[] = [];
  for (const r of [...leads, ...dus]) {
    if (SORTIS.includes(r.statut)) continue;
    if (r.statut === "rappeler" && r.rappelLe && r.rappelLe > aujourdhui) continue;
    const appeleAujourdhui = r.dernierAppel !== undefined && jourParis(r.dernierAppel) === aujourdhui;
    lignes.push({
      ...r,
      statutJour: appeleAujourdhui ? r.statut : "a_appeler",
      hier: !appeleAujourdhui && r.statut !== "a_appeler" ? r.statut : undefined,
    });
  }
  /* Les plus récents d'abord : un lead refroidit d'heure en heure. */
  lignes.sort((a, b) => (b.creeLe ?? b._creationTime) - (a.creeLe ?? a._creationTime));
  return lignes;
}

function compter(statuts: Statut[]): Record<string, number> {
  const c: Record<string, number> = {};
  for (const s of statuts) c[s] = (c[s] ?? 0) + 1;
  return c;
}

export const listes = query({
  args: { secret: v.string() },
  handler: async (ctx, { secret }) => {
    verifier(secret);
    const toutes = await ctx.db.query("listesAppel").collect();
    const sortie = [];
    for (const l of toutes) {
      if (l.genre === "rappels") continue;
      const lignes = await ctx.db
        .query("prospectsAppel")
        .withIndex("by_liste", (q) => q.eq("liste", l.cle))
        .collect();
      sortie.push({
        cle: l.cle,
        nom: l.nom,
        genre: l.genre,
        jour: l.jour ?? null,
        fait: l.fait ?? null,
        comment: l.comment ?? null,
        total: lignes.length,
        nommes: lignes.filter((x) => x.prenom).length,
        par: compter(lignes.map((x) => x.statut)),
      });
    }
    sortie.sort((a, b) => (a.jour ?? "9").localeCompare(b.jour ?? "9") || a.cle.localeCompare(b.cle));
    const rappels = await lignesRappels(ctx);
    return [
      {
        cle: "rappels",
        nom: "Rappels du jour",
        genre: "rappels" as const,
        jour: null,
        fait: null,
        comment: null,
        total: rappels.length,
        nommes: rappels.filter((x) => x.prenom).length,
        par: compter(rappels.map((x) => x.statutJour)),
      },
      ...sortie,
    ];
  },
});

export const prospects = query({
  args: { secret: v.string(), liste: v.string() },
  handler: async (ctx, { secret, liste }) => {
    verifier(secret);
    if (liste === "rappels") return await lignesRappels(ctx);
    const lignes = await ctx.db
      .query("prospectsAppel")
      .withIndex("by_liste", (q) => q.eq("liste", liste))
      .collect();
    return lignes.map((r): Ligne => ({ ...r, statutJour: r.statut }));
  },
});

export const maj = mutation({
  args: {
    secret: v.string(),
    id: v.id("prospectsAppel"),
    statut: v.optional(STATUT),
    notes: v.optional(v.string()),
    rappelLe: v.optional(v.string()),
    prenom: v.optional(v.string()),
  },
  handler: async (ctx, a) => {
    verifier(a.secret);
    const r = await ctx.db.get(a.id);
    if (!r) throw new Error("prospect introuvable");
    const patch: Partial<Doc<"prospectsAppel">> = {};
    if (a.statut) {
      patch.statut = a.statut;
      if (a.statut !== "a_appeler") {
        patch.appels = r.appels + 1;
        patch.dernierAppel = Date.now();
      }
      if (a.statut !== "rappeler") patch.rappelLe = undefined;
    }
    if (a.rappelLe !== undefined) patch.rappelLe = a.rappelLe || undefined;
    if (a.notes !== undefined) patch.notes = a.notes;
    if (a.prenom !== undefined) patch.prenom = a.prenom.trim() || undefined;
    await ctx.db.patch(a.id, patch);
    return await ctx.db.get(a.id);
  },
});

const PROSPECT = v.object({
  rang: v.number(),
  prenom: v.optional(v.string()),
  nom: v.optional(v.string()),
  entreprise: v.string(),
  telephone: v.string(),
  ville: v.optional(v.string()),
  etat: v.optional(v.string()),
  comte: v.optional(v.string()),
  adresse: v.optional(v.string()),
  site: v.optional(v.string()),
  avis: v.optional(v.number()),
  note: v.optional(v.number()),
  fermeture: v.optional(v.string()),
  sourceNom: v.optional(v.string()),
  noteNom: v.optional(v.string()),
  categorie: v.optional(v.string()),
});

/* Charge une liste. Idempotent : une fiche déjà présente (même liste, même
   téléphone) n'est ni dupliquée ni écrasée, ses statuts et ses notes restent. */
export const importer = mutation({
  args: {
    secret: v.string(),
    liste: v.object({
      cle: v.string(),
      nom: v.string(),
      jour: v.optional(v.string()),
      fait: v.optional(v.string()),
      comment: v.optional(v.string()),
    }),
    prospects: v.array(PROSPECT),
  },
  handler: async (ctx, { secret, liste, prospects }) => {
    verifier(secret);
    const existante = await ctx.db
      .query("listesAppel")
      .withIndex("by_cle", (q) => q.eq("cle", liste.cle))
      .first();
    if (existante) {
      await ctx.db.patch(existante._id, { nom: liste.nom, jour: liste.jour, fait: liste.fait, comment: liste.comment });
    } else {
      await ctx.db.insert("listesAppel", { ...liste, genre: "froid", creeLe: Date.now() });
    }
    const deja = new Set(
      (
        await ctx.db
          .query("prospectsAppel")
          .withIndex("by_liste", (q) => q.eq("liste", liste.cle))
          .collect()
      ).map((r) => r.telephone),
    );
    let ajoutes = 0;
    for (const p of prospects) {
      if (deja.has(p.telephone)) continue;
      await ctx.db.insert("prospectsAppel", { ...p, liste: liste.cle, statut: "a_appeler", appels: 0 });
      deja.add(p.telephone);
      ajoutes++;
    }
    return { ajoutes, ignores: prospects.length - ajoutes };
  },
});

/* Vide une liste de cold calling (la liste et toutes ses fiches), pour la
   recharger proprement. Les rappels ne se suppriment pas : ils viennent des leads. */
export const supprimer = mutation({
  args: { secret: v.string(), cle: v.string() },
  handler: async (ctx, { secret, cle }) => {
    verifier(secret);
    if (cle === "rappels") throw new Error("la liste des rappels ne se supprime pas");
    const lignes = await ctx.db
      .query("prospectsAppel")
      .withIndex("by_liste", (q) => q.eq("liste", cle))
      .collect();
    for (const r of lignes) await ctx.db.delete(r._id);
    const liste = await ctx.db
      .query("listesAppel")
      .withIndex("by_cle", (q) => q.eq("cle", cle))
      .first();
    if (liste) await ctx.db.delete(liste._id);
    return { supprimes: lignes.length };
  },
});

/* Les leads de test (envois de vérification du site, essais d'Alexandre) ne se rappellent pas. */
function estTest(lead: Doc<"leads">): boolean {
  const email = (lead.email ?? "").toLowerCase();
  return (
    /@example\.(com|org|net)$/.test(email) ||
    ["alexpmichelet@gmail.com", "office@nativesquare.fr"].includes(email) ||
    /^(test|verif)\b/i.test(lead.prenom ?? "") ||
    /^\d{3}555\d{4}$/.test((lead.telephone ?? "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, ""))
  );
}

function dixChiffres(tel: string): string | null {
  let d = tel.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  return d.length === 10 ? d : null;
}

/* Recopie dans la liste « rappels » les leads des 21 derniers jours qui ont un
   numéro américain, et marque réservés ceux qui ont réservé depuis. */
export const synchroRappels = mutation({
  args: { secret: v.string() },
  handler: async (ctx, { secret }) => {
    verifier(secret);
    const existante = await ctx.db
      .query("listesAppel")
      .withIndex("by_cle", (q) => q.eq("cle", "rappels"))
      .first();
    if (!existante) {
      await ctx.db.insert("listesAppel", { cle: "rappels", nom: "Rappels du jour", genre: "rappels", creeLe: Date.now() });
    }
    const limite = Date.now() - 21 * 86400_000;
    const leads = await ctx.db.query("leads").order("desc").take(400);
    let ajoutes = 0;
    let reserves = 0;
    for (const lead of leads) {
      if (lead._creationTime < limite) break;
      const tel = dixChiffres(lead.telephone ?? "");
      if (!tel) continue;
      const ligne = await ctx.db
        .query("prospectsAppel")
        .withIndex("by_leadId", (q) => q.eq("leadId", lead._id))
        .first();
      if (estTest(lead)) {
        if (ligne) await ctx.db.delete(ligne._id);
        continue;
      }
      if (lead.statut === "reserve") {
        if (ligne && ligne.statut !== "booke") {
          await ctx.db.patch(ligne._id, { statut: "booke" });
          reserves++;
        }
        continue;
      }
      const contexte = [
        lead.statut === "partiel" ? "A laissé ses coordonnées, pas les questions" : "A répondu aux questions, n'a pas réservé",
        lead.capacite ? `Chantiers par mois : ${lead.capacite}` : "",
        lead.zone ? `Zone : ${lead.zone}` : "",
        lead.role ? `Rôle : ${lead.role}` : "",
        lead.chiffreAffaires ? `Chiffre d'affaires : ${lead.chiffreAffaires}` : "",
        lead.delai ? `Délai : ${lead.delai}` : "",
        lead.sourcesChantiers?.length ? `Ses chantiers viennent de : ${lead.sourcesChantiers.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      if (ligne) {
        await ctx.db.patch(ligne._id, {
          prenom: lead.prenom,
          nom: lead.nom,
          telephone: tel,
          email: lead.email,
          contexte,
          etat: ligne.etat,
        });
        continue;
      }
      await ctx.db.insert("prospectsAppel", {
        liste: "rappels",
        rang: ajoutes + 1,
        prenom: lead.prenom,
        nom: lead.nom,
        entreprise: lead.siteWeb || "(entreprise inconnue)",
        telephone: tel,
        email: lead.email,
        site: lead.siteWeb,
        etat: lead.zone,
        contexte,
        leadId: lead._id,
        creeLe: lead._creationTime,
        statut: "a_appeler",
        appels: 0,
      });
      ajoutes++;
    }
    return { ajoutes, reserves };
  },
});
