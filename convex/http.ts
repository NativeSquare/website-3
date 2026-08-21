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
        title?: string;
        startTime?: string;
        status?: string;
        attendees?: Array<{ name?: string; email?: string }>;
        responses?: Record<string, unknown>;
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

    return new Response("ok", { status: 200 });
  }),
});

export default http;
