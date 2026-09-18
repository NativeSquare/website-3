import { v } from "convex/values";
import { internalAction } from "./_generated/server";

/**
 * Pose l'evenement « appeler le prospect » dans le Google Agenda d'Alexandre,
 * avec ses rappels. Remplace le texto de rappel : chez Quo, les SMS vers un
 * numero francais se facturent en plus, l'agenda ne coute rien.
 *
 * Authentification par compte de service : aucun consentement a rejouer,
 * aucun jeton a rafraichir. Il suffit qu'Alexandre partage son agenda avec
 * l'adresse du compte de service, en « Modifier les evenements ».
 * Doc : https://developers.google.com/identity/protocols/oauth2/service-account
 */

const SCOPE = "https://www.googleapis.com/auth/calendar.events";

function base64url(octets: Uint8Array): string {
  let binaire = "";
  for (const o of octets) binaire += String.fromCharCode(o);
  return btoa(binaire).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/* La cle du compte de service arrive en PEM ; WebCrypto veut du DER. */
function pemVersDer(pem: string): ArrayBuffer {
  const corps = pem
    .replace(/\\n/g, "\n")
    .replace(/-----[A-Z ]+-----/g, "")
    .replace(/\s+/g, "");
  const binaire = atob(corps);
  const octets = new Uint8Array(new ArrayBuffer(binaire.length));
  for (let i = 0; i < binaire.length; i++) octets[i] = binaire.charCodeAt(i);
  return octets.buffer;
}

async function jeton(): Promise<string> {
  const email = process.env.GOOGLE_SA_EMAIL;
  const pem = process.env.GOOGLE_SA_KEY;
  if (!email || !pem) throw new Error("GOOGLE_SA_EMAIL ou GOOGLE_SA_KEY absent");

  const maintenant = Math.floor(Date.now() / 1000);
  const encodeur = new TextEncoder();
  const entete = base64url(encodeur.encode(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const corps = base64url(
    encodeur.encode(
      JSON.stringify({
        iss: email,
        scope: SCOPE,
        aud: "https://oauth2.googleapis.com/token",
        iat: maintenant,
        exp: maintenant + 3600,
      }),
    ),
  );

  const cle = await crypto.subtle.importKey(
    "pkcs8",
    pemVersDer(pem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = base64url(
    new Uint8Array(
      await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cle, encodeur.encode(`${entete}.${corps}`)),
    ),
  );

  const reponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${entete}.${corps}.${signature}`,
    }),
  });
  const donnees = (await reponse.json()) as {
    access_token?: string;
    error_description?: string;
    error?: string;
  };
  if (!reponse.ok || !donnees.access_token) {
    throw new Error(
      `Google token ${reponse.status} : ${donnees.error_description ?? donnees.error ?? ""}`,
    );
  }
  return donnees.access_token;
}

/**
 * Quinze minutes posees deux heures avant le rendez-vous. Les notifications
 * (la veille et une heure avant) viennent des reglages de l agenda cible.
 */
export const poserAppel = internalAction({
  args: {
    titre: v.string(),
    description: v.string(),
    debutAppel: v.string(),
    finAppel: v.string(),
  },
  returns: v.string(),
  handler: async (_ctx, args) => {
    const agenda = process.env.GOOGLE_CALENDAR_ID;
    if (!agenda) throw new Error("GOOGLE_CALENDAR_ID absent");

    const acces = await jeton();
    const reponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(agenda)}/events`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${acces}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: args.titre,
          description: args.description,
          start: { dateTime: args.debutAppel },
          end: { dateTime: args.finAppel },
          /* Les rappels d un evenement appartiennent a celui qui le regarde : un
             compte de service ne peut pas poser les notifications d Alexandre.
             On laisse donc l agenda appliquer ses reglages par defaut, et c est
             sur l agenda « Appels prospects » qu on met 1 jour et 1 heure. */
          reminders: { useDefault: true },
        }),
      },
    );
    const corps = await reponse.text();
    if (!reponse.ok) {
      throw new Error(`Google Calendar ${reponse.status} : ${corps.slice(0, 200)}`);
    }
    return (JSON.parse(corps) as { id?: string }).id ?? "(sans id)";
  },
});
