import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Cal.com signe le corps brut en HMAC-SHA256 avec le secret du webhook et pose
 * le condense hexadecimal dans `x-cal-signature-256`.
 * Doc : https://cal.com/docs/developing/guides/automation/webhooks
 */
async function signatureValide(corps: string, entete: string | null) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("CAL_WEBHOOK_SECRET absent de l'environnement Convex");
  }
  if (!entete) {
    return false;
  }
  const cle = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const brut = await crypto.subtle.sign(
    "HMAC",
    cle,
    new TextEncoder().encode(corps),
  );
  const attendu = Array.from(new Uint8Array(brut))
    .map((o) => o.toString(16).padStart(2, "0"))
    .join("");

  /* Comparaison a temps constant. */
  const recu = entete.trim().toLowerCase();
  if (recu.length !== attendu.length) {
    return false;
  }
  let ecart = 0;
  for (let i = 0; i < attendu.length; i++) {
    ecart |= attendu.charCodeAt(i) ^ recu.charCodeAt(i);
  }
  return ecart === 0;
}

/**
 * Une reponse a une question de reservation arrive tantot comme valeur nue,
 * tantot comme objet `{ label, value }` selon la version de Cal.com.
 */
function valeurReponse(reponse: unknown): string | undefined {
  if (typeof reponse === "string") {
    return reponse || undefined;
  }
  if (reponse && typeof reponse === "object" && "value" in reponse) {
    const valeur = (reponse as { value: unknown }).value;
    return typeof valeur === "string" && valeur ? valeur : undefined;
  }
  return undefined;
}

/* Le telephone saisi dans le formulaire, au format que Quo attend (+1...). Un
   numero a dix chiffres est americain. */
function telephoneInternational(saisi: string): string | undefined {
  const chiffres = saisi.replace(/\D/g, "");
  if (saisi.trim().startsWith("+") && chiffres.length >= 10) return `+${chiffres}`;
  if (chiffres.length === 10) return `+1${chiffres}`;
  if (chiffres.length === 11 && chiffres.startsWith("1")) return `+${chiffres}`;
  return undefined;
}

/* Le lien de visio, quand Cal.com le donne : il est dans les metadonnees, dans
   les donnees de visio, ou dans le lieu de l'evenement. */
function lienVisio(p: {
  metadata?: { videoCallUrl?: string };
  videoCallData?: { url?: string };
  location?: string;
}): string | undefined {
  const candidats = [p.metadata?.videoCallUrl, p.videoCallData?.url, p.location];
  return candidats.find((c) => typeof c === "string" && c.startsWith("http"));
}

const http = httpRouter();

http.route({
  path: "/cal/booking",
  method: "POST",
  handler: httpAction(async (ctx, requete) => {
    const corps = await requete.text();

    if (!(await signatureValide(corps, requete.headers.get("x-cal-signature-256")))) {
      return new Response("signature invalide", { status: 401 });
    }

    const evenement = JSON.parse(corps) as {
      triggerEvent?: string;
      payload?: {
        uid?: string;
        rescheduleUid?: string;
        title?: string;
        startTime?: string;
        status?: string;
        attendees?: Array<{ name?: string; email?: string; timeZone?: string }>;
        responses?: Record<string, unknown>;
        metadata?: { videoCallUrl?: string };
        videoCallData?: { url?: string };
        location?: string;
      };
    };

    const attendus = ["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED"];
    if (!evenement.triggerEvent || !attendus.includes(evenement.triggerEvent)) {
      return new Response("ignore", { status: 200 });
    }

    const p = evenement.payload ?? {};
    if (!p.uid) {
      return new Response("uid absent", { status: 400 });
    }

    const invite = p.attendees?.[0];
    await ctx.runMutation(internal.rendezvous.creer, {
      visiteId: valeurReponse(p.responses?.visite),
      calUid: p.uid,
      titre: p.title,
      nom: invite?.name,
      email: invite?.email,
      debut: p.startTime,
      statut: p.status ?? evenement.triggerEvent,
    });

    const cree = evenement.triggerEvent === "BOOKING_CREATED";
    const reprogramme = evenement.triggerEvent === "BOOKING_RESCHEDULED";

    /* Un rendez-vous annule ou deplace ne doit plus rien envoyer. Cal.com donne
       a un rendez-vous deplace un nouvel identifiant et garde l'ancien dans
       rescheduleUid : c'est l'ancienne sequence qu'il faut arreter. */
    if (!cree) {
      await ctx.runMutation(internal.sequence.annuler, { calUid: p.uid });
      if (p.rescheduleUid) {
        await ctx.runMutation(internal.sequence.annuler, { calUid: p.rescheduleUid });
      }
    }

    /* Le role et le chiffre d'affaires du lead partent avec le Schedule. */
    let roleLead: string | undefined;
    let chiffreAffairesLead: string | undefined;

    if (cree || reprogramme) {
      /* Le lead du formulaire passe en « reserve ». Un echec ici ne doit pas
         faire rejouer le webhook : le rendez-vous est deja enregistre. */
      try {
        const lead = await ctx.runMutation(internal.leads.marquerReserve, {
          email: invite?.email,
          calUid: p.uid,
          debut: p.startTime,
        });
        roleLead = lead?.role;
        chiffreAffairesLead = lead?.chiffreAffaires;
        /* Les reservations du tunnel de la landing recoivent la sequence
           (e-mails, depuis Resend) toute seule, y compris apres un
           deplacement. Celles qui ne viennent pas du formulaire (appels a
           froid, page interne) gardent leur depart manuel, avec la phrase
           notee pendant l'appel. */
        if (lead && invite?.email && p.startTime) {
          await ctx.runMutation(internal.sequence.demarrerAuto, {
            calUid: p.uid,
            prenom: lead.prenom,
            nom: invite.name,
            email: invite.email,
            telephone: telephoneInternational(lead.telephone),
            sms: lead.consentSms,
            fuseau: invite.timeZone ?? "America/New_York",
            debut: p.startTime,
            lienVisio: lienVisio(p),
          });
        }
      } catch (erreur) {
        console.error("[leads] suite de la reservation a echoue", erreur);
      }
    }

    if (cree) {
      /* La reservation part a Meta (API Conversions) hors de la reponse au
         webhook : Cal.com n'attend pas Meta, et un echec Meta ne touche pas
         le rendez-vous. Sans identifiant ni token dans l'environnement,
         l'action ne fait rien. Un deplacement ne compte pas une seconde fois. */
      await ctx.scheduler.runAfter(0, internal.meta.schedule, {
        calUid: p.uid,
        visiteId: valeurReponse(p.responses?.visite),
        email: invite?.email,
        nom: invite?.name,
        role: roleLead,
        revenue: chiffreAffairesLead,
      });
    }

    return new Response("ok", { status: 200 });
  }),
});

export default http;
