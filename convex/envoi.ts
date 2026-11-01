/**
 * Les deux envois bruts, e-mail (Resend) et texto (Quo), pour les modules qui
 * ne passent pas par la sequence post-booking. Le meme appel que celui de
 * sequence.ts, sans les pieces jointes.
 */

/* Resend : https://resend.com/docs/api-reference/emails/send-email */
export async function envoyerEmail(a: string, objet: string, texte: string): Promise<void> {
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

/* Texto : Quo par defaut, HighLevel (numero A2P) quand SMS_CANAL vaut « ghl ». */
export async function envoyerSms(a: string, texte: string): Promise<void> {
  if (process.env.SMS_CANAL === "ghl") return envoyerSmsGhl(a, texte);
  return envoyerSmsQuo(a, texte);
}

/* HighLevel : le contact est retrouve (ou cree) par son telephone, puis le texto part du numero A2P.
   Doc : https://marketplace.gohighlevel.com/docs/ghl/conversations/send-a-new-message
         https://marketplace.gohighlevel.com/docs/ghl/contacts/upsert-contact */
export async function envoyerSmsGhl(a: string, texte: string): Promise<void> {
  const jeton = process.env.GHL_TOKEN;
  const lieu = process.env.GHL_LOCATION_ID;
  const numero = process.env.GHL_NUMERO_SMS;
  if (!jeton || !lieu || !numero) throw new Error("GHL_TOKEN, GHL_LOCATION_ID ou GHL_NUMERO_SMS absent");

  const base = "https://services.leadconnectorhq.com";
  const entetes = (version: string) => ({
    Authorization: `Bearer ${jeton}`,
    Version: version,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  const contact = await fetch(`${base}/contacts/upsert`, {
    method: "POST",
    headers: entetes("2021-07-28"),
    body: JSON.stringify({ locationId: lieu, phone: a }),
  });
  if (!contact.ok) throw new Error(`HighLevel contact ${contact.status} : ${await contact.text()}`);
  const contactId = ((await contact.json()) as { contact?: { id?: string } }).contact?.id;
  if (!contactId) throw new Error("HighLevel : contact sans identifiant");

  const message = await fetch(`${base}/conversations/messages`, {
    method: "POST",
    headers: entetes("2021-04-15"),
    body: JSON.stringify({ type: "SMS", contactId, message: texte, fromNumber: numero }),
  });
  if (!message.ok) throw new Error(`HighLevel message ${message.status} : ${await message.text()}`);
}

/* Quo : https://support.quo.com/core-concepts/integrations/api */
async function envoyerSmsQuo(a: string, texte: string): Promise<void> {
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
