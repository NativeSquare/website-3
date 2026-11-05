import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { aReponduParSms, envoyerEmail, envoyerSms } from "./envoi";
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
 * Le fil, pour un lead qui arrive (formulaire Meta ou formulaire de la landing).
 * Version du 05/11/2026 (sequence-confirmation-oui-v8) :
 *   verification  1 min 30 apres le formulaire quand Alexandre dort (23 h a 8 h a
 *            Paris) et que RELANCE_AUTO vaut 1 ; 5 min sinon. S'il a reserve (sa
 *            fiche, ou un rendez-vous a son e-mail, alias compris) ou si Alexandre a
 *            dit stop, rien. Sinon :
 *            - Alexandre dort : la relance part toute seule, tout de suite ;
 *            - il est disponible : alerte Slack « appelle-le ». Il a une heure ;
 *              passe ce delai, la relance part quand meme.
 *   Premier message (`r1` dans le code)  e-mail et texto tout de suite. Le texto
 *            ignore la plage 8 h a 18 h Pacifique (SMS_PREMIER_IMMEDIAT=0 la remet).
 *   R2       le lendemain a 9 h au Pacifique : e-mail et texto.
 *   R3       47 h apres R2, a 9 h au Pacifique : e-mail et texto, le dernier.
 * Chaque envoi reverifie juste avant de partir qu'il n'a pas reserve. R2 et R3
 * verifient aussi qu'il n'a pas repondu par texto au premier message (HighLevel) :
 * s'il a repondu, la relance s'arrete et Alexandre est prevenu sur Slack.
 *
 * Interrupteur : RELANCE_AUTO=1 dans l'environnement Convex pour que les
 * departs automatiques soient actifs. Sans lui, rien ne part tout seul ; le
 * depart manuel (`lancerManuel`) marche toujours.
 *
 * A la main, depuis le dossier du site :
 *   npx convex run relance:apercu '{"email":"x@y.com","mode":"manuel"}'   (rien n'est envoye)
 *   npx convex run relance:lancerManuel '{"email":"x@y.com"}'             (il n'a pas decroche)
 *   ... avec '"prenom":"there"' quand le prenom de la fiche est faux (nom d'entreprise)
 *   npx convex run relance:arreter '{"email":"x@y.com"}'                  (stop)
 *   npx convex run relance:etat '{"email":"x@y.com"}'                     (ce qui est parti)
 */

const ETAPES = ["r1_email", "r1_sms", "r2_email", "r2_sms", "r3_email", "r3_sms"] as const;
type Etape = (typeof ETAPES)[number];

/* Les pages dont une ouverture est notee dans `vues` (le meme ensemble que le
   champ `page` du schema). */
const pageVue = v.union(
  v.literal("guide"),
  v.literal("reservation"),
  v.literal("video"),
  v.literal("cas_roofing"),
  v.literal("cas_septic"),
);
type PageVue = "guide" | "reservation" | "video" | "cas_roofing" | "cas_septic";

/* Le journal `envois` est range par calUid : une relance y prend sa propre cle. */
const cleJournal = (leadId: Id<"leads">) => `relance-${leadId}`;

function sommeil(): { debut: number; fin: number } {
  return {
    debut: Number(process.env.SOMMEIL_DEBUT ?? 23),
    fin: Number(process.env.SOMMEIL_FIN ?? 8),
  };
}

/* ----------------------------------------------------------------- lecture */

/* « jean+rdv@gmail.com » et « jean@gmail.com » sont la meme boite. */
const emailSansAlias = (e: string) => e.trim().toLowerCase().replace(/\+[^@]*@/, "@");

/* A-t-il reserve depuis qu'il a rempli le formulaire ? Sa fiche le dit quand la
   reservation passe par Cal.com avec son e-mail. Mais une reservation par
   Calendly, ou avec un alias de son e-mail, ne change pas la fiche : on regarde
   aussi les rendez-vous. Un rendez-vous annule ne compte pas. */
async function aReserve(ctx: { db: QueryCtx["db"] }, lead: Doc<"leads">): Promise<boolean> {
  if (lead.statut === "reserve") return true;
  const cible = emailSansAlias(lead.email);
  const recents = await ctx.db.query("rendezvous").order("desc").take(300);
  return recents.some(
    (r) =>
      !!r.email &&
      r._creationTime >= lead._creationTime &&
      emailSansAlias(r.email) === cible &&
      !/cancel|reject/i.test(r.statut ?? ""),
  );
}

export const contexte = internalQuery({
  args: { leadId: v.id("leads") },
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.db.get(leadId);
    const relance = await ctx.db
      .query("relances")
      .withIndex("by_leadId", (q) => q.eq("leadId", leadId))
      .unique();
    const journal = await ctx.db
      .query("envois")
      .withIndex("by_calUid", (q) => q.eq("calUid", cleJournal(leadId)))
      .take(50);
    return {
      lead,
      relance,
      deja: journal.filter((l) => l.etat === "envoye").map((l) => l.etape),
      reserve: lead ? await aReserve(ctx, lead) : false,
    };
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
  args: {
    email: v.string(),
    mode: v.optional(v.union(v.literal("auto"), v.literal("manuel"))),
    prenom: v.optional(v.string()),
  },
  handler: async (ctx, { email, mode, prenom }) => {
    const lead = await leadParEmail(ctx, email);
    if (!lead) return "lead inconnu";
    const m: ModeRelance = mode ?? "auto";
    const q = quand(lead._creationTime, Date.now());
    const plan = planRelances(Date.now());
    const blocs: string[] = [`Lead : ${lead.prenom} | ${lead.email} | ${telephoneUS(lead.telephone) ?? "(pas de texto : numero absent ou invalide)"} | mode ${m}`];
    for (const etape of ["r1", "r2", "r3"] as EtapeRelance[]) {
      const e = messageRelance(etape, "email", { prenom: prenom ?? lead.prenom, quand: q, mode: m, leadId: lead._id });
      const s = messageRelance(etape, "sms", { prenom: prenom ?? lead.prenom, quand: q, mode: m, leadId: lead._id });
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
    const programmes: string[] = [];
    for (const id of relance?.taches ?? []) {
      const job = await ctx.db.system.get(id);
      const etape = (job?.args?.[0] as { etape?: string } | undefined)?.etape;
      if (job && job.state.kind === "pending" && etape) {
        programmes.push(`${etape} ${new Date(job.scheduledTime).toISOString()}`);
      }
    }
    programmes.sort();
    const vues = await ctx.db
      .query("vues")
      .withIndex("by_lead_page", (q) => q.eq("leadId", lead._id))
      .take(50);
    return {
      lead: { prenom: lead.prenom, statut: lead.statut },
      vues: vues.map((x) => `${x.page} ${new Date(x._creationTime).toISOString()}`),
      relance: relance ? { etat: relance.etat, mode: relance.mode, motif: relance.motif } : null,
      envois: envois.map((e) => `${e.etape} ${e.canal} ${e.etat}${e.erreur ? " : " + e.erreur : ""}`),
      programmes,
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
async function lancer(
  ctx: MutationCtx,
  leadId: Id<"leads">,
  mode: ModeRelance,
  prenomMessage?: string,
): Promise<string> {
  const existante = await relanceDe(ctx, leadId);
  if (existante && existante.etat !== "en_attente") {
    return `rien lance : relance deja ${existante.etat}`;
  }
  /* Le texto du premier message part tout de suite, meme hors de la plage 8 h a
     18 h Pacifique (decision d'Alexandre du 05/11/2026). SMS_PREMIER_IMMEDIAT=0
     dans l'environnement Convex le remet dans la plage. */
  const smsImmediat = process.env.SMS_PREMIER_IMMEDIAT !== "0";
  const plan = planRelances(Date.now(), smsImmediat);
  const taches: Id<"_scheduled_functions">[] = [];
  for (const etape of ETAPES) {
    const forcer = smsImmediat && etape === "r1_sms";
    taches.push(
      await ctx.scheduler.runAt(plan[etape], internal.relance.envoyer, {
        leadId,
        etape,
        ...(forcer ? { forcer: true } : {}),
      }),
    );
  }
  const champs = {
    etat: "en_cours" as const,
    mode,
    lancee: Date.now(),
    taches,
    ...(prenomMessage ? { prenomMessage } : {}),
  };
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
    if (await aReserve(ctx, lead)) return "rien : il a reserve";
    if (lead.variante === "general") return "rien : formulaire general";
    if (leadDeTest(lead)) return "rien : fiche de test";
    if (await relanceDe(ctx, leadId)) return "rien : relance deja traitee";
    if (process.env.RELANCE_AUTO !== "1") return "rien : departs automatiques desactives (RELANCE_AUTO)";

    const { debut, fin } = sommeil();
    if (alexandreDort(Date.now(), debut, fin)) {
      const resultat = await lancer(ctx, leadId, "auto");
      if (resultat === "relance lancee") {
        await prevenir(
          ctx,
          `*Follow-up sent automatically (you're asleep).* ${lead.prenom} filled the form and didn't book. Email and text now, then tomorrow morning and in 3 days.`,
        );
      }
      return `${resultat} (il dort)`;
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
  args: { email: v.string(), prenom: v.optional(v.string()) },
  returns: v.string(),
  handler: async (ctx, { email, prenom }): Promise<string> => {
    const lead = await leadParEmail(ctx, email);
    if (!lead) return "lead inconnu";
    if (lead.statut === "reserve") return "rien lance : il a deja reserve";
    const resultat = await lancer(ctx, lead._id, "manuel", prenom);
    if (resultat === "relance lancee") {
      await prevenir(ctx, `*Follow-up launched by hand* for ${lead.prenom}: email and text now, then tomorrow morning and in 3 days.`);
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

/* Deplace, annule ou avance des etapes d'une relance en cours. Pour chaque
   etape citee, ce qui est programme est retire ; si `quand` est donne, elle est
   reprogrammee a cet instant (`forcer` : un texto part sans attendre la plage
   horaire). Sans `quand`, l'etape est seulement annulee. */
export const replanifier = internalMutation({
  args: {
    email: v.string(),
    changements: v.array(
      v.object({ etape: v.string(), quand: v.optional(v.number()), forcer: v.optional(v.boolean()) }),
    ),
  },
  returns: v.string(),
  handler: async (ctx, { email, changements }): Promise<string> => {
    const lead = await leadParEmail(ctx, email);
    if (!lead) return "lead inconnu";
    const relance = await relanceDe(ctx, lead._id);
    if (!relance || relance.etat !== "en_cours") return "rien : pas de relance en cours";

    const visees = new Set(changements.map((c) => c.etape));
    const gardees: Id<"_scheduled_functions">[] = [];
    const annulees: string[] = [];
    for (const id of relance.taches) {
      const job = await ctx.db.system.get(id);
      const etape = (job?.args?.[0] as { etape?: string } | undefined)?.etape;
      if (job && job.state.kind === "pending" && etape && visees.has(etape)) {
        await ctx.scheduler.cancel(id);
        annulees.push(etape);
      } else {
        gardees.push(id);
      }
    }
    const posees: string[] = [];
    for (const c of changements) {
      if (c.quand === undefined) continue;
      gardees.push(
        await ctx.scheduler.runAt(c.quand, internal.relance.envoyer, {
          leadId: lead._id,
          etape: c.etape,
          ...(c.forcer ? { forcer: true } : {}),
        }),
      );
      posees.push(`${c.etape} -> ${new Date(c.quand).toISOString()}`);
    }
    await ctx.db.patch(relance._id, { taches: gardees });
    return `annulees : ${annulees.join(", ") || "aucune"} | posees : ${posees.join(", ") || "aucune"}`;
  },
});

/* ------------------------------------------------------------------- envoi */

export const envoyer = internalAction({
  args: {
    leadId: v.id("leads"),
    etape: v.string(),
    /* Texto : part tout de suite, sans attendre la plage 8 h a 18 h Pacifique. */
    forcer: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, { leadId, etape, forcer }) => {
    const { lead, relance, deja, reserve } = await ctx.runQuery(internal.relance.contexte, { leadId });
    if (!lead || !relance || relance.etat !== "en_cours") return null;
    /* Une etape deja partie ne repart jamais, quoi qu'on ait replanifie. */
    if (deja.includes(etape)) return null;
    if (reserve) {
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

    /* R2 et R3 ne partent que s'il n'a pas repondu au premier message. On lit les
       textos entrants dans HighLevel depuis le lancement ; une reponse par e-mail
       n'est pas vue. Si HighLevel ne repond pas, le message part quand meme et
       l'erreur est notee. */
    const numeroUS = telephoneUS(lead.telephone);
    if (numero !== "r1" && numeroUS && relance.lancee) {
      try {
        if (await aReponduParSms(numeroUS, relance.lancee)) {
          await ctx.runMutation(internal.relance.arreter, { leadId, motif: "a repondu" });
          await ctx.scheduler.runAfter(0, internal.relance.slack, {
            texte: `Follow-up stopped: ${lead.prenom} answered by text. Take it from here.\n${lead.telephone} | ${lead.email}`,
          });
          return null;
        }
      } catch (erreur) {
        await journal("ignore", numeroUS, `lecture des reponses impossible : ${erreur instanceof Error ? erreur.message : String(erreur)}`);
      }
    }

    /* Un texto hors plage attend la prochaine : c'est la meme etape, repoussee. */
    if (canal === "sms") {
      const ouverture = fenetreSms(Date.now());
      if (!forcer && ouverture > Date.now() + 60_000) {
        await ctx.scheduler.runAt(ouverture, internal.relance.envoyer, { leadId, etape });
        return null;
      }
      /* Les relances sont des messages marketing : elles demandent la case
         « marketing ». Un lead d'avant (ou du formulaire Meta) n'a que
         `consentSms` : il garde la regle d'avant. */
      if ((lead.consentSmsMarketing ?? lead.consentSms) !== true) {
        await journal("ignore", lead.telephone, "pas d'accord aux SMS de relance");
        return null;
      }
    }

    const destinataire = canal === "sms" ? telephoneUS(lead.telephone) : lead.email;
    if (!destinataire) {
      await journal("ignore", canal === "sms" ? lead.telephone : "(inconnu)", "numero absent ou invalide");
      return null;
    }

    const message = messageRelance(e, canal, {
      prenom: relance.prenomMessage ?? lead.prenom,
      quand: quand(lead._creationTime, Date.now()),
      mode,
      leadId,
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

/* Le prenom et l'e-mail du lead derriere un lien de relance (`?r=`), pour
   pre-remplir le calendrier : il n'a rien a retaper. Appelee par la page
   /hvac/call cote serveur (le secret ne quitte pas le serveur). L'identifiant
   Convex est introuvable par hasard, et le lien n'est envoye qu'a la personne. */
export const pourReservation = query({
  args: { secret: v.string(), r: v.string() },
  returns: v.union(v.null(), v.object({ prenom: v.string(), email: v.string() })),
  handler: async (ctx, { secret, r }) => {
    if (secret !== process.env.MOTEUR_SECRET) return null;
    const leadId = ctx.db.normalizeId("leads", r);
    const lead = leadId ? await ctx.db.get(leadId) : null;
    return lead ? { prenom: lead.prenom, email: lead.email } : null;
  },
});

/* Une page ouverte depuis un lien de relance. Appelee par la route Next
   `/api/relance/vue` (le secret reste cote serveur). Chaque ouverture est
   gardee ; la premiere de chaque page, pour un lead qui n'a pas reserve, previent
   Alexandre sur Slack : c'est le moment de l'appeler. */
/* Le canal d'une ouverture. La visite a ete notee a l'arrivee sur la page, avec
   les UTM du lien (medium = email ou sms, content = le message) et l'identifiant
   du lead (`r`) dans ses parametres : on la retrouve parmi les plus recentes.
   Rien a changer cote page : l'ouverture se rattache apres coup. */
const CHEMINS: Record<PageVue, string> = {
  guide: "/hvac/guide",
  reservation: "/hvac/call",
  video: "/before-our-call",
  cas_roofing: "/cases/roofing",
  cas_septic: "/cases/septic",
};

async function canalDeLaVue(
  ctx: { db: QueryCtx["db"] },
  r: string,
  page: PageVue,
): Promise<{ canal?: string; message?: string }> {
  const chemin = CHEMINS[page];
  const recentes = await ctx.db.query("visites").order("desc").take(80);
  const visite = recentes.find((x) => x.parametres?.r === r && x.chemin.startsWith(chemin));
  return { canal: visite?.utmMedium, message: visite?.utmContent };
}

/* Pour verifier un lien sans rien ecrire :
   npx convex run relance:canalVue '{"r":"<identifiant du lead>","page":"guide"}' */
export const canalVue = internalQuery({
  args: { r: v.string(), page: pageVue },
  returns: v.object({ canal: v.optional(v.string()), message: v.optional(v.string()) }),
  handler: async (ctx, { r, page }) => await canalDeLaVue(ctx, r, page),
});

export const vue = mutation({
  args: {
    secret: v.string(),
    r: v.string(),
    page: pageVue,
  },
  returns: v.null(),
  handler: async (ctx, { secret, r, page }) => {
    if (secret !== process.env.MOTEUR_SECRET) throw new Error("secret invalide");
    const leadId = ctx.db.normalizeId("leads", r);
    if (!leadId) return null;
    const lead = await ctx.db.get(leadId);
    if (!lead) return null;

    const deja = await ctx.db
      .query("vues")
      .withIndex("by_lead_page", (q) => q.eq("leadId", leadId).eq("page", page))
      .first();
    const { canal, message } = await canalDeLaVue(ctx, r, page);
    await ctx.db.insert("vues", { leadId, page, ...(canal ? { canal } : {}), ...(message ? { message } : {}) });

    /* Un lead qui a reserve ne declenche rien, sauf s'il etait absent a son
       rendez-vous : c'est la relance d'absent qui lui a donne ce lien. */
    const rendezvous = lead.calUid
      ? await ctx.db
          .query("rendezvous")
          .withIndex("by_calUid", (q) => q.eq("calUid", lead.calUid!))
          .unique()
      : null;
    const absent = rendezvous?.issue === "absent";
    /* Le guide et le calendrier ne previennent que pour un lead qui n'a pas
       reserve (c'est le moment de l'appeler). La page pre-appel et les
       one-pagers sont faits pour ceux qui ont reserve : eux previennent
       toujours. */
    const pourReserves = page === "video" || page === "cas_roofing" || page === "cas_septic";
    if (deja || leadDeTest(lead)) return null;
    if (!pourReserves && lead.statut === "reserve" && !absent) return null;

    const qui = absent ? `${lead.prenom} (missed the call)` : lead.prenom;
    const via = canal === "email" ? " (email link)" : canal === "sms" ? " (text link)" : "";
    const quoi =
      page === "guide"
        ? `*${qui} just opened the guide*${via}. Good moment to call.`
        : page === "video"
          ? `*${qui} just opened the pre-call page*${via}.`
          : page === "cas_roofing" || page === "cas_septic"
            ? `*${qui} just opened the ${page === "cas_roofing" ? "roofing" : "septic"} one-pager*${via}.`
            : absent
              ? `*${qui} is looking at the booking calendar*${via} to pick a new time.`
              : `*${lead.prenom} is looking at the booking calendar*${via} and hasn't booked yet.`;
    await ctx.scheduler.runAfter(0, internal.relance.slack, {
      texte: `${quoi}\n${lead.telephone ?? "no phone"} | ${lead.email}${message ? ` | link: ${message}` : ""}`,
    });
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
