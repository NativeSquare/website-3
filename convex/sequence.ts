import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  EMAIL_1,
  EMAIL_2,
  EMAIL_3,
  SMS_1,
  SMS_2,
  SMS_3,
  type Contact,
} from "../src/lib/sequence-messages";

/**
 * La sequence post-booking : trois emails, trois textos au prospect, et un
 * rappel a Alexandre deux heures avant pour qu'il passe son coup de fil.
 *
 * Tout est pose a la reservation par le planificateur Convex, donc rien ne
 * depend d'un serveur qui tourne ni d'un abonnement Cal.com payant.
 *
 * Source des textes : atlas/agence/mentorat-angelo/assets-precall/sequence-post-booking.md
 */

const TRENTE_MIN = 30 * 60 * 1000;
/* En dessous, une etape tomberait trop pres de la precedente : on la saute. */
const MARGE = 5 * 60 * 1000;

type Etape = "email1" | "sms1" | "email2" | "sms2" | "email3" | "sms3";

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
    const donnees = {
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
    };

    /* Une reservation rejouee ne doit pas envoyer deux fois. */
    const existante = await ctx.db
      .query("sequences")
      .withIndex("by_calUid", (q) => q.eq("calUid", args.calUid))
      .unique();
    if (existante && !existante.annulee) {
      return { etapes: [] };
    }

    const debut = new Date(args.debut).getTime();
    const maintenant = Date.now();
    const milieu = maintenant + (debut - maintenant) / 2;

    /* Chaque etape a son moment. Une etape deja depassee est simplement
       sautee : un rendez-vous cale dans l'heure ne recoit que l'immediat. */
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
      if (quand > maintenant + MARGE) {
        taches.push(
          await ctx.scheduler.runAt(quand, internal.sequence.envoyer, {
            calUid: args.calUid,
            etape,
          }),
        );
        etapes.push(etape);
      } else if (quand <= maintenant + MARGE && quand >= maintenant - MARGE) {
        taches.push(
          await ctx.scheduler.runAfter(0, internal.sequence.envoyer, {
            calUid: args.calUid,
            etape,
          }),
        );
        etapes.push(etape);
      }
    }

    if (existante) {
      await ctx.db.patch(existante._id, { ...donnees, taches, annulee: false });
    } else {
      await ctx.db.insert("sequences", { ...donnees, taches, annulee: false });
    }
    return { etapes };
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

export const envoyer = internalAction({
  args: { calUid: v.string(), etape: v.string() },
  returns: v.null(),
  handler: async (ctx, { calUid, etape }) => {
    const sequence = await ctx.runQuery(internal.sequence.parCalUid, { calUid });
    if (!sequence || sequence.annulee) return null;

    const contact: Contact = {
      prenom: sequence.prenom,
      entreprise: sequence.entreprise,
      note: sequence.note,
      debut: sequence.debut,
      fuseau: sequence.fuseau,
      lienVisio: sequence.lienVisio,
    };

    const canal: "email" | "sms" = etape.startsWith("email") ? "email" : "sms";

    const message =
      etape === "email1" ? EMAIL_1(contact)
      : etape === "email2" ? EMAIL_2(contact)
      : etape === "email3" ? EMAIL_3(contact)
      : etape === "sms1" ? SMS_1(contact)
      : etape === "sms2" ? SMS_2(contact)
      : SMS_3(contact);

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
        await envoyerEmail(destinataire, message.objet ?? "", message.texte);
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

/* Resend : https://resend.com/docs/api-reference/emails/send-email */
async function envoyerEmail(a: string, objet: string, texte: string) {
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
