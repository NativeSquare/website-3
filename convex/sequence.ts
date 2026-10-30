import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import {
  EMAIL_1,
  EMAIL_2,
  EMAIL_3,
  EMAIL_ABSENT,
  EMAIL_B1,
  EMAIL_B2,
  SMS_1,
  SMS_2,
  SMS_3,
  SMS_ABSENT,
  SMS_B1,
  SMS_B2,
  heure,
  jour,
  type Contact,
  type Lien,
} from "../src/lib/sequence-messages";
import { fenetreSms, lienAbsent, lienSuivi } from "../src/lib/relance";

/**
 * La sequence post-booking, depuis le 30/10/2026 :
 *   B1  a la reservation : « reply YES to confirm » (e-mail + texto).
 *   B2  « no show risk » : ni YES ni signal d'Alexandre 3 h apres la reservation
 *       (ou quand il le dit) : e-mail + texto avec le guide.
 *   B3  la confirmation (`email1`, `sms1`), posee quand le rendez-vous passe en
 *       « confirme », avec la suite : mi-chemin (`email2`, `sms2`) et 30
 *       minutes avant (`email3`, `sms3`).
 * Un rendez-vous pris au telephone pendant l'appel (page interne) est confirme
 * d'emblee. Les sequences d'avant (sans `confirmation`) comptent comme confirmees.
 *
 * Tout est pose par le planificateur Convex, donc rien ne depend d'un serveur
 * qui tourne ni d'un abonnement Cal.com payant.
 *
 * A la main, depuis le dossier du site :
 *   npx convex run sequence:confirmer '{"email":"x@y.com"}'     (il est confirme)
 *   npx convex run sequence:noShowRisk '{"email":"x@y.com"}'    (pas joint, relance)
 * ... ou avec '{"calUid":"..."}'.
 *
 * Source des textes : atlas/agence/mentorat-angelo/assets-precall/sequence-confirmation-oui-v5-2026-10-30.md
 */

const TRENTE_MIN = 30 * 60 * 1000;
/* En dessous, une etape tomberait trop pres de la precedente : on la saute. */
const MARGE = 5 * 60 * 1000;
/* Sans YES ni signal d'Alexandre apres ce delai, le rendez-vous passe en
   « no show risk » (dans la plage des textos, 8 h a 18 h Pacifique). */
const DELAI_NO_SHOW = 3 * 60 * 60 * 1000;

type Etape =
  | "b1_email"
  | "b1_sms"
  | "b2_email"
  | "b2_sms"
  | "email1"
  | "sms1"
  | "email2"
  | "sms2"
  | "email3"
  | "sms3";

/* Quand un rendez-vous est deplace, ces etapes ne repartent pas si elles sont
   deja parties pour l'ancien : la confirmation et le message de mi-chemin. Le
   rappel de 30 minutes (email3, sms3) est lie a l'heure du rendez-vous : il
   repart toujours, pour la nouvelle heure. */
const UNE_SEULE_FOIS: Etape[] = ["email1", "sms1", "email2", "sms2"];

/* Ecrit dans le journal quand une etape est sautee a cause d'un deplacement,
   pour qu'un deuxieme deplacement sache lui aussi qu'elle est deja partie. */
const DEJA_PARTIE = "deja partie avant le deplacement";

/* ---------------------------------------------------------------- lecture */

export const parCalUid = internalQuery({
  args: { calUid: v.string() },
  handler: async (ctx, { calUid }) => {
    return await ctx.db
      .query("sequences")
      .withIndex("by_calUid", (q) => q.eq("calUid", calUid))
      .unique();
  },
});

/* Le journal, lisible dans le tableau de bord Convex. */
export const envoisRecents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("envois").order("desc").take(100);
  },
});

/* --------------------------------------------------------------- demarrage */

type Donnees = {
  calUid: string;
  prenom: string;
  nom?: string;
  email: string;
  telephone?: string;
  entreprise?: string;
  note?: string;
  fuseau: string;
  debut: string;
  lienVisio?: string;
};

/* Les etapes de l'ancienne sequence qui sont deja parties. Un envoi compte
   quand il est « envoye », ou quand un deplacement precedent l'a note comme
   deja parti. Un envoi en echec ou ignore ne compte pas : il repartira. */
async function etapesDejaParties(ctx: MutationCtx, calUid: string): Promise<Set<string>> {
  const lignes = await ctx.db
    .query("envois")
    .withIndex("by_calUid", (q) => q.eq("calUid", calUid))
    .take(100);
  return new Set(
    lignes
      .filter((l) => l.etat === "envoye" || (l.etat === "ignore" && l.erreur === DEJA_PARTIE))
      .map((l) => l.etape),
  );
}

/**
 * Pose la suite d'un rendez-vous confirme : la confirmation (B3) tout de suite,
 * le message de mi-chemin entre la reservation (`creation`) et l'appel, et le
 * rappel 30 minutes avant. Une etape deja depassee est sautee : un rendez-vous
 * confirme dans l'heure ne recoit que l'immediat. Ce qui est deja parti pour
 * l'ancien rendez-vous (`ancienCalUid`, quand celui-ci a ete deplace) ne repart
 * pas.
 */
async function poserSuite(
  ctx: MutationCtx,
  s: {
    calUid: string;
    email: string;
    telephone?: string;
    debut: string;
    avecSms: boolean;
    ancienCalUid?: string;
  },
  creation: number,
): Promise<{ taches: Id<"_scheduled_functions">[]; etapes: string[] }> {
  const dejaParties = s.ancienCalUid
    ? await etapesDejaParties(ctx, s.ancienCalUid)
    : new Set<string>();

  const debut = new Date(s.debut).getTime();
  const maintenant = Date.now();
  const milieu = creation + (debut - creation) / 2;

  const plan: Array<{ etape: Etape; quand: number }> = [
    { etape: "email1", quand: maintenant },
    { etape: "sms1", quand: maintenant },
    { etape: "email2", quand: milieu },
    { etape: "sms2", quand: milieu },
    { etape: "email3", quand: debut - TRENTE_MIN },
    { etape: "sms3", quand: debut - TRENTE_MIN },
  ];

  const taches: Id<"_scheduled_functions">[] = [];
  const etapes: string[] = [];
  for (const { etape, quand } of plan) {
    if (!s.avecSms && etape.startsWith("sms")) continue;
    if (UNE_SEULE_FOIS.includes(etape) && dejaParties.has(etape)) {
      const sms = etape.startsWith("sms");
      await ctx.db.insert("envois", {
        calUid: s.calUid,
        etape,
        canal: sms ? "sms" : "email",
        destinataire: (sms ? s.telephone : s.email) ?? "(inconnu)",
        etat: "ignore",
        erreur: DEJA_PARTIE,
      });
      continue;
    }
    if (quand > maintenant + MARGE) {
      taches.push(
        await ctx.scheduler.runAt(quand, internal.sequence.envoyer, { calUid: s.calUid, etape }),
      );
      etapes.push(etape);
    } else if (quand >= maintenant - MARGE) {
      taches.push(
        await ctx.scheduler.runAfter(0, internal.sequence.envoyer, { calUid: s.calUid, etape }),
      );
      etapes.push(etape);
    }
  }
  return { taches, etapes };
}

/**
 * Pose les etapes de la sequence dans le planificateur. Commun au depart
 * manuel (page interne, rendez-vous pris au telephone : confirme d'emblee) et
 * au depart automatique (reservation du tunnel de la landing ou de Calendly :
 * « a_confirmer », B1 tout de suite et passage en no show risk apres 3 h).
 * `avecSms` : les textos ne partent que si on le dit.
 * `ancienCalUid` : le rendez-vous que celui-ci remplace, quand il a ete deplace.
 * Un rendez-vous deja confirme le reste ; ce qui est deja parti ne repart pas ;
 * la suite s'ajuste a la nouvelle heure.
 */
async function planifier(
  ctx: MutationCtx,
  donnees: Donnees,
  avecSms: boolean,
  ancienCalUid: string | undefined,
  confirme: boolean,
): Promise<{ etapes: string[] }> {
  /* Une reservation rejouee ne doit pas envoyer deux fois. */
  const existante = await ctx.db
    .query("sequences")
    .withIndex("by_calUid", (q) => q.eq("calUid", donnees.calUid))
    .unique();
  if (existante && !existante.annulee) {
    return { etapes: [] };
  }

  /* Un report garde la confirmation de l'ancien rendez-vous. */
  let confirmation: "a_confirmer" | "confirme" = confirme ? "confirme" : "a_confirmer";
  if (ancienCalUid && !confirme) {
    const ancienne = await ctx.db
      .query("sequences")
      .withIndex("by_calUid", (q) => q.eq("calUid", ancienCalUid))
      .unique();
    if (ancienne && (ancienne.confirmation ?? "confirme") === "confirme") {
      confirmation = "confirme";
    }
  }

  const maintenant = Date.now();
  const taches: Id<"_scheduled_functions">[] = [];
  const etapes: string[] = [];

  if (confirmation === "confirme") {
    const suite = await poserSuite(ctx, { ...donnees, avecSms, ancienCalUid }, maintenant);
    taches.push(...suite.taches);
    etapes.push(...suite.etapes);
  } else {
    for (const etape of ["b1_email", "b1_sms"] as const) {
      if (etape === "b1_sms" && !avecSms) continue;
      taches.push(
        await ctx.scheduler.runAfter(0, internal.sequence.envoyer, {
          calUid: donnees.calUid,
          etape,
        }),
      );
      etapes.push(etape);
    }
    /* Sans YES ni signal d'Alexandre : no show risk, dans la plage des textos,
       et seulement si l'appel est assez loin pour que ca serve. */
    const declenchement = fenetreSms(maintenant + DELAI_NO_SHOW);
    if (declenchement < new Date(donnees.debut).getTime() - TRENTE_MIN) {
      taches.push(
        await ctx.scheduler.runAt(declenchement, internal.sequence.noShowRisk, {
          calUid: donnees.calUid,
          auto: true,
        }),
      );
      etapes.push("no_show_risk");
    }
  }

  const champs = { ...donnees, taches, annulee: false, confirmation, avecSms, ancienCalUid };
  if (existante) {
    await ctx.db.patch("sequences", existante._id, champs);
  } else {
    await ctx.db.insert("sequences", champs);
  }
  return { etapes };
}

/* La sequence d'un rendez-vous, par identifiant Cal.com ou par e-mail (la plus
   recente qui n'est pas annulee). */
async function trouver(
  ctx: MutationCtx,
  calUid?: string,
  email?: string,
): Promise<Doc<"sequences"> | null> {
  if (calUid) {
    return await ctx.db
      .query("sequences")
      .withIndex("by_calUid", (q) => q.eq("calUid", calUid))
      .unique();
  }
  if (!email) return null;
  for (const adresse of new Set([email.trim().toLowerCase(), email.trim()])) {
    const lignes = await ctx.db
      .query("sequences")
      .withIndex("by_email", (q) => q.eq("email", adresse))
      .order("desc")
      .take(10);
    const active = lignes.find((l) => !l.annulee);
    if (active) return active;
  }
  return null;
}

export const demarrer = mutation({
  args: {
    secret: v.string(),
    calUid: v.string(),
    prenom: v.string(),
    nom: v.optional(v.string()),
    email: v.string(),
    telephone: v.optional(v.string()),
    entreprise: v.optional(v.string()),
    note: v.optional(v.string()),
    fuseau: v.string(),
    debut: v.string(),
    lienVisio: v.optional(v.string()),
  },
  returns: v.object({ etapes: v.array(v.string()) }),
  handler: async (ctx, args) => {
    if (args.secret !== process.env.MOTEUR_SECRET) {
      throw new Error("secret invalide");
    }

    /* Le secret ne va pas en base : on recopie champ par champ. */
    return await planifier(
      ctx,
      {
        calUid: args.calUid,
        prenom: args.prenom,
        nom: args.nom,
        email: args.email,
        telephone: args.telephone,
        entreprise: args.entreprise,
        note: args.note,
        fuseau: args.fuseau,
        debut: args.debut,
        lienVisio: args.lienVisio,
      },
      true,
      undefined,
      /* Pris au telephone, pendant l'appel : confirme d'emblee. */
      true,
    );
  },
});

/**
 * Depart automatique, appele par le webhook Cal.com quand quelqu'un qui est
 * passe par le formulaire de la landing reserve (et par la route Calendly). Le
 * rendez-vous est « a confirmer » : B1 part tout de suite. Les e-mails partent
 * toujours ; les textos seulement si la personne a coche la case d'accord aux
 * SMS et a donne un numero valide.
 */
export const demarrerAuto = internalMutation({
  args: {
    calUid: v.string(),
    prenom: v.string(),
    nom: v.optional(v.string()),
    email: v.string(),
    telephone: v.optional(v.string()),
    /* L'accord aux SMS donne dans le formulaire. Sans lui, aucun texto. */
    sms: v.boolean(),
    fuseau: v.string(),
    debut: v.string(),
    lienVisio: v.optional(v.string()),
    /* Present quand la reservation vient d'un deplacement : l'identifiant
       Cal.com de l'ancien rendez-vous. */
    ancienCalUid: v.optional(v.string()),
  },
  returns: v.object({ etapes: v.array(v.string()) }),
  handler: async (ctx, { sms, ancienCalUid, ...donnees }) => {
    return await planifier(ctx, donnees, sms && !!donnees.telephone, ancienCalUid, false);
  },
});

/* ------------------------------------------------------------ confirmation */

const libelle = (c: "a_confirmer" | "no_show_risk" | "confirme" | undefined) =>
  c === "no_show_risk" ? "en no show risk" : c === "a_confirmer" ? "a confirmer" : "confirme";

async function prevenir(ctx: MutationCtx, texte: string) {
  await ctx.scheduler.runAfter(0, internal.relance.slack, { texte });
}

/**
 * « No show risk » : le lead n'a ni repondu YES ni ete joint. Part tout seul 3 h
 * apres la reservation (`auto`), ou quand Alexandre dit « je ne l'ai pas
 * joint ». Envoie B2 : e-mail, et texto si les textos sont permis.
 */
export const noShowRisk = internalMutation({
  args: {
    calUid: v.optional(v.string()),
    email: v.optional(v.string()),
    auto: v.optional(v.boolean()),
  },
  returns: v.string(),
  handler: async (ctx, { calUid, email, auto }): Promise<string> => {
    const s = await trouver(ctx, calUid, email);
    if (!s || s.annulee) return "rien : rendez-vous inconnu ou annule";
    const etat = s.confirmation ?? "confirme";
    if (etat !== "a_confirmer") return `rien : deja ${libelle(etat)}`;
    if (new Date(s.debut).getTime() <= Date.now()) return "rien : le rendez-vous est passe";

    const taches = [...s.taches];
    const etapes: Etape[] = s.avecSms ? ["b2_email", "b2_sms"] : ["b2_email"];
    for (const etape of etapes) {
      taches.push(
        await ctx.scheduler.runAfter(0, internal.sequence.envoyer, { calUid: s.calUid, etape }),
      );
    }
    await ctx.db.patch("sequences", s._id, { confirmation: "no_show_risk", taches });
    await prevenir(
      ctx,
      `*No show risk.* ${s.prenom} hasn't confirmed ${jour(s)} at ${heure(s.debut, s.fuseau)}${auto ? " (3 h after booking)" : ""}. Reminder sent by email${s.avecSms ? " and text" : ""}.\n${s.telephone ?? "no phone"} | ${s.email}`,
    );
    return `no show risk : ${etapes.join(", ")}`;
  },
});

/**
 * « Confirme » : le lead a repondu YES, ou Alexandre le dit. Envoie B3, puis pose
 * le message de mi-chemin et le rappel de 30 minutes. Un message dont l'heure
 * est deja passee ne part pas.
 */
export const confirmer = internalMutation({
  args: { calUid: v.optional(v.string()), email: v.optional(v.string()) },
  returns: v.string(),
  handler: async (ctx, { calUid, email }): Promise<string> => {
    const s = await trouver(ctx, calUid, email);
    if (!s || s.annulee) return "rien : rendez-vous inconnu ou annule";
    if ((s.confirmation ?? "confirme") === "confirme") return "rien : deja confirme";
    if (new Date(s.debut).getTime() <= Date.now()) return "rien : le rendez-vous est passe";

    const suite = await poserSuite(
      ctx,
      {
        calUid: s.calUid,
        email: s.email,
        telephone: s.telephone,
        debut: s.debut,
        avecSms: s.avecSms ?? false,
        ancienCalUid: s.ancienCalUid,
      },
      s._creationTime,
    );
    await ctx.db.patch("sequences", s._id, {
      confirmation: "confirme",
      taches: [...s.taches, ...suite.taches],
    });
    return `confirme : ${suite.etapes.join(", ") || "rien a programmer"}`;
  },
});

/* Annulation ou report : tout ce qui n'est pas parti est retire. */
export const annuler = internalMutation({
  args: { calUid: v.string() },
  returns: v.null(),
  handler: async (ctx, { calUid }) => {
    const sequence = await ctx.db
      .query("sequences")
      .withIndex("by_calUid", (q) => q.eq("calUid", calUid))
      .unique();
    if (!sequence) return null;
    for (const tache of sequence.taches) {
      await ctx.scheduler.cancel(tache);
    }
    await ctx.db.patch(sequence._id, { taches: [], annulee: true });
    return null;
  },
});

/* ----------------------------------------------------------------- envoi */

export const journaliser = internalMutation({
  args: {
    calUid: v.string(),
    etape: v.string(),
    canal: v.union(v.literal("email"), v.literal("sms"), v.literal("agenda")),
    destinataire: v.string(),
    etat: v.union(v.literal("envoye"), v.literal("echec"), v.literal("ignore")),
    erreur: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.insert("envois", args);
    return null;
  },
});

/* La sequence et, si on la retrouve par son e-mail, la fiche lead : son
   identifiant (`r`) va dans les liens, ce qui dit QUI ouvre chaque page. */
export const contexteEnvoi = internalQuery({
  args: { calUid: v.string() },
  handler: async (ctx, { calUid }) => {
    const sequence = await ctx.db
      .query("sequences")
      .withIndex("by_calUid", (q) => q.eq("calUid", calUid))
      .unique();
    if (!sequence) return null;
    const lead = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", sequence.email.trim().toLowerCase()))
      .order("desc")
      .first();
    return { sequence, leadId: lead?._id };
  },
});

export const envoyer = internalAction({
  args: { calUid: v.string(), etape: v.string() },
  returns: v.null(),
  handler: async (ctx, { calUid, etape }) => {
    const contexte = await ctx.runQuery(internal.sequence.contexteEnvoi, { calUid });
    if (!contexte || contexte.sequence.annulee) return null;
    const { sequence, leadId } = contexte;

    /* B1 ne part pas si le lead est deja confirme ; B2 seulement en no show
       risk ; la confirmation et la suite seulement une fois confirme. */
    const etat = sequence.confirmation ?? "confirme";
    if (etape.startsWith("b1") && etat === "confirme") return null;
    if (etape.startsWith("b2") && etat !== "no_show_risk") return null;
    if (!etape.startsWith("b") && etat !== "confirme") return null;

    const contact: Contact = {
      prenom: sequence.prenom,
      entreprise: sequence.entreprise,
      note: sequence.note,
      debut: sequence.debut,
      fuseau: sequence.fuseau,
      lienVisio: sequence.lienVisio,
      calUid: sequence.calUid,
    };

    const canal: "email" | "sms" = etape.includes("sms") ? "sms" : "email";

    /* Chaque lien porte la campagne, le canal, le message (« b2-guide »,
       « b3-video », « midway-roofing », « rappel-video ») et `r`. Seuls les liens
       d'autres sites (visio, Google Agenda) n'ont pas de suivi. */
    const prefixe = etape.startsWith("b2")
      ? "b2"
      : etape.endsWith("1")
        ? "b3"
        : etape.endsWith("2")
          ? "midway"
          : "rappel";
    const lien: Lien = (page, contenu) =>
      lienSuivi(page, canal, contenu ?? `${prefixe}-${page}`, leadId);

    const message =
      etape === "b1_email" ? EMAIL_B1(contact)
      : etape === "b1_sms" ? SMS_B1(contact)
      : etape === "b2_email" ? EMAIL_B2(contact, lien)
      : etape === "b2_sms" ? SMS_B2(contact, lien)
      : etape === "email1" ? EMAIL_1(contact, lien)
      : etape === "email2" ? EMAIL_2(contact, lien)
      : etape === "email3" ? EMAIL_3(contact, lien)
      : etape === "sms1" ? SMS_1(contact, lien)
      : etape === "sms2" ? SMS_2(contact, lien)
      : SMS_3(contact, lien);

    const destinataire = canal === "email" ? sequence.email : (sequence.telephone ?? "");

    if (!destinataire) {
      await ctx.runMutation(internal.sequence.journaliser, {
        calUid, etape, canal, destinataire: "(inconnu)", etat: "ignore",
        erreur: canal === "sms" ? "pas de numero" : "pas d'email",
      });
      return null;
    }

    try {
      if (canal === "email") {
        await envoyerEmail(
          destinataire,
          message.objet ?? "",
          message.texte,
          message.pieces,
          message.ics,
        );
      } else {
        await envoyerSms(destinataire, message.texte);
      }
      await ctx.runMutation(internal.sequence.journaliser, {
        calUid, etape, canal, destinataire, etat: "envoye",
      });
    } catch (erreur) {
      await ctx.runMutation(internal.sequence.journaliser, {
        calUid, etape, canal, destinataire, etat: "echec",
        erreur: erreur instanceof Error ? erreur.message : String(erreur),
      });
    }
    return null;
  },
});

/* ----------------------------------------------------------------- absent */

/* Tout ce qu'il faut pour decider d'une relance : le rendez-vous, sa sequence,
   le lead (accord aux SMS) et ce qui est deja parti. */
export const contexteAbsent = internalQuery({
  args: { calUid: v.string() },
  handler: async (ctx, { calUid }) => {
    const sequence = await ctx.db
      .query("sequences")
      .withIndex("by_calUid", (q) => q.eq("calUid", calUid))
      .unique();
    const rendezvous = await ctx.db
      .query("rendezvous")
      .withIndex("by_calUid", (q) => q.eq("calUid", calUid))
      .unique();
    const email = (sequence?.email ?? rendezvous?.email)?.trim().toLowerCase();
    const lead = email
      ? await ctx.db
          .query("leads")
          .withIndex("by_email", (q) => q.eq("email", email))
          .order("desc")
          .first()
      : null;
    const journal = await ctx.db
      .query("envois")
      .withIndex("by_calUid", (q) => q.eq("calUid", calUid))
      .take(100);
    return { sequence, rendezvous, lead, journal };
  },
});

/* L'issue « absent » dans le tableau de bord, sans ecraser une issue deja notee. */
export const marquerAbsent = internalMutation({
  args: { calUid: v.string() },
  returns: v.null(),
  handler: async (ctx, { calUid }) => {
    const rendezvous = await ctx.db
      .query("rendezvous")
      .withIndex("by_calUid", (q) => q.eq("calUid", calUid))
      .unique();
    if (rendezvous && !rendezvous.issue) {
      await ctx.db.patch(rendezvous._id, { issue: "absent" });
    }
    return null;
  },
});

/**
 * La relance d'un absent : un e-mail et un texto, envoyes ensemble, avec le
 * lien pour reprendre rendez-vous. Une seule fois, pas de seconde relance.
 *
 * Jamais automatique : elle ne part que quand Alexandre dit « il n'etait pas la,
 * envoie-lui la sequence » (rien ne l'appelle, ni le webhook Cal.com ni le
 * planificateur). A la main :
 *   npx convex run sequence:relancerAbsent '{"calUid":"..."}'
 * Avec "apercu":true, rend les deux textes sans rien envoyer.
 *
 * Ne part pas si : le rendez-vous n'a pas encore eu lieu, il a ete annule ou
 * deplace, une issue est deja notee, ou la personne a deja repris rendez-vous.
 * Le texto ne part qu'avec l'accord donne dans le formulaire.
 */
export const relancerAbsent = internalAction({
  args: { calUid: v.string(), apercu: v.optional(v.boolean()) },
  returns: v.string(),
  handler: async (ctx, { calUid, apercu }): Promise<string> => {
    const { sequence, rendezvous, lead, journal } = await ctx.runQuery(
      internal.sequence.contexteAbsent,
      { calUid },
    );

    const email = sequence?.email ?? rendezvous?.email;
    const debut = sequence?.debut ?? rendezvous?.debut;
    if (!email || !debut) return "rien envoye : rendez-vous inconnu";
    if (sequence?.annulee) return "rien envoye : rendez-vous annule ou deplace";
    if (new Date(debut).getTime() > Date.now()) {
      return "rien envoye : le rendez-vous n'a pas encore eu lieu";
    }
    if (rendezvous?.issue && rendezvous.issue !== "absent") {
      return `rien envoye : issue deja notee (${rendezvous.issue})`;
    }
    if (lead?.calUid && lead.calUid !== calUid) {
      return "rien envoye : une autre reservation existe deja pour cette personne";
    }

    const contact: Contact = {
      prenom: sequence?.prenom ?? lead?.prenom ?? rendezvous?.nom?.split(" ")[0] ?? "there",
      debut,
      fuseau: sequence?.fuseau ?? "America/New_York",
      calUid,
    };
    /* Les liens portent l'identifiant du lead : calendrier prerempli, et on sait
       qui ouvre le guide. Sans fiche lead, les liens restent mais sans `r`. */
    const mail = EMAIL_ABSENT(contact, {
      call: lienAbsent("call", "email", lead?._id),
      guide: lienAbsent("guide", "email", lead?._id),
    });
    const texto = SMS_ABSENT(contact, {
      call: lienAbsent("call", "sms", lead?._id),
      guide: lienAbsent("guide", "sms", lead?._id),
    });
    /* Le texto exige l'accord du formulaire ET un numero. */
    const telephone = lead?.consentSms === true ? sequence?.telephone : undefined;

    if (apercu) {
      return [
        `A : ${email}  |  objet : ${mail.objet}`,
        mail.texte,
        `A : ${telephone ?? "(pas de texto : pas d'accord ou pas de numero)"}`,
        texto.texte,
      ].join("\n\n");
    }

    const lignes: string[] = [];
    const etape = async (
      nom: string,
      canal: "email" | "sms",
      destinataire: string | undefined,
      envoi: () => Promise<void>,
    ) => {
      if (journal.some((l) => l.etape === nom && l.etat === "envoye")) {
        lignes.push(`${nom} : deja parti`);
        return;
      }
      if (!destinataire) {
        await ctx.runMutation(internal.sequence.journaliser, {
          calUid, etape: nom, canal, destinataire: "(inconnu)", etat: "ignore",
          erreur: canal === "sms" ? "pas de numero ou pas d'accord aux SMS" : "pas d'email",
        });
        lignes.push(`${nom} : ignore`);
        return;
      }
      try {
        await envoi();
        await ctx.runMutation(internal.sequence.journaliser, {
          calUid, etape: nom, canal, destinataire, etat: "envoye",
        });
        lignes.push(`${nom} : envoye`);
      } catch (erreur) {
        const message = erreur instanceof Error ? erreur.message : String(erreur);
        await ctx.runMutation(internal.sequence.journaliser, {
          calUid, etape: nom, canal, destinataire, etat: "echec", erreur: message,
        });
        lignes.push(`${nom} : echec (${message})`);
      }
    };

    await etape("email_absent", "email", email, () =>
      envoyerEmail(email, mail.objet ?? "", mail.texte),
    );
    await etape("sms_absent", "sms", telephone, () => envoyerSms(telephone!, texto.texte));
    await ctx.runMutation(internal.sequence.marquerAbsent, { calUid });
    return lignes.join(", ");
  },
});

/* Resend : https://resend.com/docs/api-reference/emails/send-email */
async function envoyerEmail(
  a: string,
  objet: string,
  texte: string,
  pieces?: { filename: string; url: string }[],
  ics?: { filename: string; contenu: string },
) {
  const cle = process.env.RESEND_API_KEY;
  const expediteur = process.env.EXPEDITEUR_EMAIL;
  if (!cle || !expediteur) throw new Error("RESEND_API_KEY ou EXPEDITEUR_EMAIL absent");

  const reponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: expediteur,
      to: [a],
      subject: objet,
      text: texte,
      ...(pieces?.length || ics
        ? {
            attachments: [
              ...(pieces ?? []).map((p) => ({ filename: p.filename, path: p.url })),
              ...(ics
                ? [
                    {
                      filename: ics.filename,
                      content: btoa(ics.contenu),
                      content_type: "text/calendar",
                    },
                  ]
                : []),
            ],
          }
        : {}),
      reply_to: process.env.REPONSE_EMAIL ?? expediteur,
    }),
  });
  if (!reponse.ok) throw new Error(`Resend ${reponse.status} : ${await reponse.text()}`);
}

/* Quo : https://support.quo.com/core-concepts/integrations/api */
async function envoyerSms(a: string, texte: string) {
  const cle = process.env.QUO_API_KEY;
  const numero = process.env.QUO_NUMERO;
  if (!cle || !numero) throw new Error("QUO_API_KEY ou QUO_NUMERO absent");

  const reponse = await fetch("https://api.quo.com/v1/messages", {
    method: "POST",
    headers: { Authorization: cle, "Content-Type": "application/json" },
    body: JSON.stringify({ from: numero, to: [a], content: texte }),
  });
  if (!reponse.ok) throw new Error(`Quo ${reponse.status} : ${await reponse.text()}`);
}
