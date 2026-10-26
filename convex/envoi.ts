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

/* Quo : https://support.quo.com/core-concepts/integrations/api */
export async function envoyerSms(a: string, texte: string): Promise<void> {
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
