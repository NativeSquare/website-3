import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { envoyerEmail, envoyerSms } from "./envoi";
import {
  DELAI_REPLI_AUTO,
  alexandreDort,
  fenetreSms,
  leadDeTest,
  messageRelance,
  planRelances,
  quand,
  telephoneUS,
  type EtapeRelance,
  type ModeRelance,
} from "../src/lib/relance";

/**
 * La relance des leads qui ont envoye un formulaire sans prendre rendez-vous.
 * Ce n'est pas la sequence post-booking : celle-la part quand un rendez-vous
 * existe, celle-ci quand il n'y en a pas.
 *
 * Le fil, pour un lead qui arrive (formulaire Meta ou formulaire de la landing) :
 *   +5 min   verification : s'il a reserve ou si Alexandre a dit stop, rien.
 *            Sinon :
 *            - Alexandre dort (23 h a 8 h a Paris) : la relance part toute seule ;
 *            - il est disponible : alerte Slack « appelle-le ». Il a une heure ;
 *              passe ce delai, la relance part quand meme.
 *   R1       e-mail tout de suite, texto dans la plage 8 h a 18 h Pacifique.
 *   R2       le lendemain vers 9 h au Pacifique : e-mail et texto.
 *   R3       trois jours apres R1 : e-mail et texto, le dernier.
 * Chaque envoi reverifie juste avant de partir que le lead n'a pas reserve.
 *
 * Interrupteur : RELANCE_AUTO=1 dans l'environnement Convex pour que les
 * departs automatiques soient actifs. Sans lui, rien ne part tout seul ; le
 * depart manuel (`lancerManuel`) marche toujours.
 *
 * A la main, depuis le dossier du site :
 *   npx convex run relance:apercu '{"email":"x@y.com","mode":"manuel"}'   (rien n'est envoye)
 *   npx convex run relance:lancerManuel '{"email":"x@y.com"}'             (il n'a pas decroche)
 *   npx convex run relance:arreter '{"email":"x@y.com"}'                  (stop)
 *   npx convex run relance:etat '{"email":"x@y.com"}'                     (ce qui est parti)
 */

const ETAPES = ["r1_email", "r1_sms", "r2_email", "r2_sms", "r3_email", "r3_sms"] as const;
type Etape = (typeof ETAPES)[number];

/* Le journal `envois` est range par calUid : une relance y prend sa propre cle. */
const cleJournal = (leadId: Id<"leads">) => `relance-${leadId}`;

function sommeil(): { debut: number; fin: number } {
  return {
    debut: Number(process.env.SOMMEIL_DEBUT ?? 23),
    fin: Number(process.env.SOMMEIL_FIN ?? 8),
  };
}

/* ----------------------------------------------------------------- lecture */

export const contexte = internalQuery({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.db.get(leadId);
    const relance = await ctx.db
      .query("relances")
      .withIndex("by_leadId", (q) => q.eq("leadId", leadId))
      .unique();
    return { lead, relance };
  },
});

async function leadParEmail(ctx: { db: QueryCtx["db"] }, email: string) {
  return await ctx.db
    .query("leads")
    .withIndex("by_email", (q) => q.eq("email", email.trim().toLowerCase()))
    .order("desc")
    .first();
}

/* Les six messages tels qu'ils partiraient, sans rien envoyer. */
export const apercu = internalQuery({
  args: { email: v.string(), mode: v.optional(v.union(v.literal("auto"), v.literal("manuel"))) },
  handler: async (ctx, { email, mode }) => {
    const lead = await leadParEmail(ctx, email);
    if (!lead) return "lead inconnu";
    const m: ModeRelance = mode ?? "auto";
    const q = quand(lead._creationTime, Date.now());
    const plan = planRelances(Date.now());
    const blocs: string[] = [`Lead : ${lead.prenom} | ${lead.email} | ${telephoneUS(lead.telephone) ?? "(pas de texto : numero absent ou invalide)"} | mode ${m}`];
    for (const etape of ["r1", "r2", "r3"] as EtapeRelance[]) {
      const e = messageRelance(etape, "email", { prenom: lead.prenom, quand: q, mode: m });
      const s = messageRelance(etape, "sms", { prenom: lead.prenom, quand: q, mode: m });
      blocs.push(
        `── ${etape.toUpperCase()} · e-mail, ${new Date(plan[`${etape}_email` as Etape]).toISOString()} ──\nObjet : ${e.objet}\n${e.texte}`,
        `── ${etape.toUpperCase()} · texto, ${new Date(plan[`${etape}_sms` as Etape]).toISOString()} ──\n${s.texte}`,
      );
    }
    return blocs.join("\n\n");
  },
});

/* Ou en est la relance d'un lead, et ce qui est parti. */
export const etat = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const lead = await leadParEmail(ctx, email);
    if (!lead) return "lead inconnu";
    const relance = await ctx.db
      .query("relances")
      .withIndex("by_leadId", (q) => q.eq("leadId", lead._id))
      .unique();
    const envois = await ctx.db
      .query("envois")
      .withIndex("by_calUid", (q) => q.eq("calUid", cleJournal(lead._id)))
      .take(20);
    return {
      lead: { prenom: lead.prenom, statut: lead.statut },
      relance: relance ? { etat: relance.etat, mode: relance.mode, motif: relance.motif } : null,
      envois: envois.map((e) => `${e.etape} ${e.canal} ${e.etat}${e.erreur ? " : " + e.erreur : ""}`),
    };
  },
});

/* ------------------------------------------------------------------ depart */

async function relanceDe(ctx: MutationCtx, leadId: Id<"leads">) {
  return await ctx.db
    .query("relances")
    .withIndex("by_leadId", (q) => q.eq("leadId", leadId))
    .unique();
}

async function prevenir(ctx: MutationCtx, texte: string) {
  await ctx.scheduler.runAfter(0, internal.relance.slack, { texte });
}

/* Pose les six envois dans le planificateur et note la relance « en cours ». */
async function lancer(ctx: MutationCtx, leadId: Id<"leads">, mode: ModeRelance): Promise<string> {
  const existante = await relanceDe(ctx, leadId);
  if (existante && existante.etat !== "en_attente") {
    return `rien lance : relance deja ${existante.etat}`;
  }
  const plan = planRelances(Date.now());
  const taches: Id<"_scheduled_functions">[] = [];
  for (const etape of ETAPES) {
    taches.push(await ctx.scheduler.runAt(plan[etape], internal.relance.envoyer, { leadId, etape }));
  }
  const champs = { etat: "en_cours" as const, mode, lancee: Date.now(), taches };
  if (existante) await ctx.db.patch(existante._id, champs);
  else await ctx.db.insert("relances", { leadId, ...champs });
  return "relance lancee";
}

async function stopper(ctx: MutationCtx, leadId: Id<"leads">, motif: string): Promise<void> {
  const existante = await relanceDe(ctx, leadId);
  if (existante) {
    for (const tache of existante.taches) {
      try {
        await ctx.scheduler.cancel(tache);
      } catch {
        /* deja partie ou deja annulee */
      }
    }
    await ctx.db.patch(existante._id, { etat: "stoppee", motif, taches: [] });
  } else {
    await ctx.db.insert("relances", { leadId, etat: "stoppee", motif, taches: [] });
  }
}

/* Appelee 5 minutes apres la creation du lead. */
export const verifier = internalMutation({
  args: { leadId: v.id("leads") },
  returns: v.string(),
  handler: async (ctx, { leadId }): Promise<string> => {
    const lead = await ctx.db.get(leadId);
    if (!lead) return "lead inconnu";
    if (lead.statut === "reserve") return "rien : il a reserve";
    if (lead.variante === "general") return "rien : formulaire general";
    if (leadDeTest(lead)) return "rien : fiche de test";
    if (await relanceDe(ctx, leadId)) return "rien : relance deja traitee";
    if (process.env.RELANCE_AUTO !== "1") return "rien : departs automatiques desactives (RELANCE_AUTO)";

    const { debut, fin } = sommeil();
    if (alexandreDort(Date.now(), debut, fin)) {
      await lancer(ctx, leadId, "auto");
      await prevenir(
        ctx,
        `*Follow-up sent automatically (you're asleep).* ${lead.prenom} filled the form and didn't book after 5 min. Email now, text when the window opens (8 AM to 6 PM Pacific).`,
      );
      return "relance lancee (il dort)";
    }

    /* Il est disponible : il appelle. La relance attend, avec un delai. */
    await ctx.db.insert("relances", { leadId, etat: "en_attente", taches: [] });
    const heureRepli = new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).format(new Date(Date.now() + DELAI_REPLI_AUTO));
    await ctx.scheduler.runAfter(DELAI_REPLI_AUTO, internal.relance.repliAuto, { leadId });
    await prevenir(
      ctx,
      `*Not booked after 5 min. Call ${lead.prenom} now.* ${lead.telephone} | ${lead.email}\nNo answer? Tell Claude to trigger the follow-up. Otherwise it goes out on its own at ${heureRepli} (Paris time).`,
    );
    return "alerte : il est disponible";
  },
});

/* Une heure apres l'alerte : si personne n'a pris la main, la relance part. */
export const repliAuto = internalMutation({
  args: { leadId: v.id("leads") },
  returns: v.string(),
  handler: async (ctx, { leadId }): Promise<string> => {
    const relance = await relanceDe(ctx, leadId);
    if (!relance || relance.etat !== "en_attente") return "rien : deja traitee";
    const lead = await ctx.db.get(leadId);
    if (!lead) return "lead inconnu";
    if (lead.statut === "reserve") {
      await stopper(ctx, leadId, "reserve");
      return "rien : il a reserve";
    }
    await lancer(ctx, leadId, "auto");
    await prevenir(
      ctx,
      `*Follow-up sent automatically.* ${lead.prenom} still hasn't booked, and the hour to call is over.`,
    );
    return "relance lancee (delai passe)";
  },
});

/* Alexandre l'a appele sans succes : il dit de lancer. */
export const lancerManuel = internalMutation({
  args: { email: v.string() },
  returns: v.string(),
  handler: async (ctx, { email }): Promise<string> => {
    const lead = await leadParEmail(ctx, email);
    if (!lead) return "lead inconnu";
    if (lead.statut === "reserve") return "rien lance : il a deja reserve";
    const resultat = await lancer(ctx, lead._id, "manuel");
    if (resultat === "relance lancee") {
      await prevenir(ctx, `*Follow-up launched by hand* for ${lead.prenom}: email now, text in the window, then tomorrow and in 3 days.`);
    }
    return resultat;
  },
});

/* Stop : il a reserve ailleurs, il a repondu, ou Alexandre le dit. */
export const arreter = internalMutation({
  args: { email: v.optional(v.string()), leadId: v.optional(v.id("leads")), motif: v.optional(v.string()) },
  returns: v.string(),
  handler: async (ctx, { email, leadId, motif }): Promise<string> => {
    const id = leadId ?? (email ? (await leadParEmail(ctx, email))?._id : undefined);
    if (!id) return "lead inconnu";
    await stopper(ctx, id, motif ?? "stop a la main");
    return "relance arretee";
  },
});

/* ------------------------------------------------------------------- envoi */

export const envoyer = internalAction({
  args: { leadId: v.id("leads"), etape: v.string() },
  returns: v.null(),
  handler: async (ctx, { leadId, etape }) => {
    const { lead, relance } = await ctx.runQuery(internal.relance.contexte, { leadId });
    if (!lead || !relance || relance.etat !== "en_cours") return null;
    if (lead.statut === "reserve") {
      await ctx.runMutation(internal.relance.arreter, { leadId, motif: "reserve" });
      return null;
    }

    const [numero, canalTexte] = etape.split("_");
    const e = numero as EtapeRelance;
    const canal = canalTexte === "sms" ? "sms" : "email";
    const mode: ModeRelance = relance.mode ?? "auto";
    const journal = (etat: "envoye" | "echec" | "ignore", destinataire: string, erreur?: string) =>
      ctx.runMutation(internal.sequence.journaliser, {
        calUid: cleJournal(leadId), etape, canal, destinataire, etat, ...(erreur ? { erreur } : {}),
      });

    /* Un texto hors plage attend la prochaine : c'est la meme etape, repoussee. */
    if (canal === "sms") {
      const ouverture = fenetreSms(Date.now());
      if (ouverture > Date.now() + 60_000) {
        await ctx.scheduler.runAt(ouverture, internal.relance.envoyer, { leadId, etape });
        return null;
      }
      if (lead.consentSms !== true) {
        await journal("ignore", lead.telephone, "pas d'accord aux SMS");
        return null;
      }
    }

    const destinataire = canal === "sms" ? telephoneUS(lead.telephone) : lead.email;
    if (!destinataire) {
      await journal("ignore", canal === "sms" ? lead.telephone : "(inconnu)", "numero absent ou invalide");
      return null;
    }

    const message = messageRelance(e, canal, {
      prenom: lead.prenom,
      quand: quand(lead._creationTime, Date.now()),
      mode,
    });
    try {
      if (canal === "email") await envoyerEmail(destinataire, message.objet ?? "", message.texte);
      else await envoyerSms(destinataire, message.texte);
      await journal("envoye", destinataire);
      await ctx.scheduler.runAfter(0, internal.relance.slack, {
        texte: `Follow-up ${numero.toUpperCase()} sent to ${lead.prenom} by ${canal === "sms" ? "text" : "email"} (${mode === "manuel" ? "manual" : "automatic"}).`,
      });
    } catch (erreur) {
      await journal("echec", destinataire, erreur instanceof Error ? erreur.message : String(erreur));
    }
    return null;
  },
});

/* L'alerte Slack, dans le meme canal que celles des leads. */
export const slack = internalAction({
  args: { texte: v.string() },
  returns: v.null(),
  handler: async (_ctx, { texte }) => {
    const webhook = process.env.SLACK_LEADS_WEBHOOK;
    if (!webhook) return null;
    const echappe = texte.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const reponse = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: echappe }),
    });
    if (!reponse.ok) console.error("[slack] refuse", reponse.status);
    return null;
  },
});
