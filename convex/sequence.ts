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
import type { Id } from "./_generated/dataModel";
import {
  EMAIL_1,
  EMAIL_2,
  EMAIL_3,
  EMAIL_ABSENT,
  SMS_1,
  SMS_2,
  SMS_3,
  SMS_ABSENT,
  type Contact,
} from "../src/lib/sequence-messages";
import { lienAbsent } from "../src/lib/relance";

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
 * Pose les etapes de la sequence dans le planificateur. Commun au depart
 * manuel (page interne) et au depart automatique (reservation du tunnel de la
 * landing). `avecSms` : les textos ne partent que si on le dit.
 * `ancienCalUid` : le rendez-vous que celui-ci remplace, quand il a ete deplace.
 * Ce qui est deja parti pour l'ancien ne repart pas ; la suite s'ajuste a la
 * nouvelle heure.
 */
async function planifier(
  ctx: MutationCtx,
  donnees: Donnees,
  avecSms: boolean,
  ancienCalUid?: string,
): Promise<{ etapes: string[] }> {
  /* Une reservation rejouee ne doit pas envoyer deux fois. */
  const existante = await ctx.db
    .query("sequences")
    .withIndex("by_calUid", (q) => q.eq("calUid", donnees.calUid))
    .unique();
  if (existante && !existante.annulee) {
    return { etapes: [] };
  }

  const dejaParties = ancienCalUid
    ? await etapesDejaParties(ctx, ancienCalUid)
    : new Set<string>();

  const debut = new Date(donnees.debut).getTime();
  const maintenant = Date.now();
  const milieu = maintenant + (debut - maintenant) / 2;

  /* Chaque etape a son moment. Une etape deja depassee est simplement
     sautee : un rendez-vous cale dans l'heure ne recoit que l'immediat. */
  const plan: Array<{ etape: Etape; quand: number }> = [
    /* Tout de suite, pour le depart manuel comme pour le tunnel : Alexandre
       est encore au telephone avec le patron quand le message arrive. */
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
    if (!avecSms && etape.startsWith("sms")) continue;
    if (UNE_SEULE_FOIS.includes(etape) && dejaParties.has(etape)) {
      const sms = etape.startsWith("sms");
      await ctx.db.insert("envois", {
        calUid: donnees.calUid,
        etape,
        canal: sms ? "sms" : "email",
        destinataire: (sms ? donnees.telephone : donnees.email) ?? "(inconnu)",
        etat: "ignore",
        erreur: DEJA_PARTIE,
      });
      continue;
    }
    if (quand > maintenant + MARGE) {
      taches.push(
        await ctx.scheduler.runAt(quand, internal.sequence.envoyer, {
          calUid: donnees.calUid,
          etape,
        }),
      );
      etapes.push(etape);
    } else if (quand <= maintenant + MARGE && quand >= maintenant - MARGE) {
      taches.push(
        await ctx.scheduler.runAfter(0, internal.sequence.envoyer, {
          calUid: donnees.calUid,
          etape,
        }),
      );
      etapes.push(etape);
    }
  }

  if (existante) {
    await ctx.db.patch("sequences", existante._id, { ...donnees, taches, annulee: false });
  } else {
    await ctx.db.insert("sequences", { ...donnees, taches, annulee: false });
  }
  return { etapes };
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
    );
  },
});

/**
 * Depart automatique, appele par le webhook Cal.com quand quelqu'un qui est
 * passe par le formulaire de la landing reserve. Les e-mails partent toujours ;
 * les textos seulement si la personne a coche la case d'accord aux SMS du
 * formulaire et a donne un numero valide.
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
    return await planifier(ctx, donnees, sms && !!donnees.telephone, ancienCalUid);
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
      calUid: sequence.calUid,
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
