/**
 * L'habillage des emails de la sequence, dans la charte du site : fond clair,
 * carte blanche, titre en gras serre, bouton bleu, croisillon de marque.
 *
 * Contraintes du courrier electronique : tout en styles en ligne, pas de CSS
 * externe, pas de police a charger (les clients la refusent), largeur fixe de
 * 560 px, et une version texte toujours envoyee a cote.
 */

const INK = "#060504";
const GRIS = "#4E4C4B";
const GRIS_CLAIR = "#686564";
const LIGNE = "#E6E5E5";
const FOND = "#FAFAFA";
const BLEU = "#0083F5";
const POLICE =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/* Le logo : neuf carres en degrade, dessines en HTML pour eviter une image
   distante que les clients bloquent par defaut. */
function logo(): string {
  const carre = (opacite: number) =>
    `<td width="10" height="10" style="width:10px;height:10px;background:${INK};opacity:${opacite};border-radius:3px"></td>`;
  const espace = `<td width="4" style="width:4px"></td>`;
  const ligne = (a: number, b: number, c: number) =>
    `<tr>${carre(a)}${espace}${carre(b)}${espace}${carre(c)}</tr>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate">
    ${ligne(1, 0.8, 0.55)}
    <tr><td height="4" style="height:4px"></td></tr>
    ${ligne(0.8, 0.55, 0.32)}
    <tr><td height="4" style="height:4px"></td></tr>
    ${ligne(0.55, 0.32, 0.16)}
  </table>`;
}

function echapper(texte: string): string {
  return texte
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* Les liens restent cliquables dans le corps du texte. */
function lier(texte: string): string {
  return echapper(texte).replace(
    /(https?:\/\/[^\s]+)/g,
    `<a href="$1" style="color:${BLEU};text-decoration:none">$1</a>`,
  );
}

export type EmailHtml = {
  /* Les paragraphes du message, dans l'ordre. */
  paragraphes: string[];
  /* Le bouton principal : son libelle et son adresse. */
  bouton?: { libelle: string; url: string };
  /* La signature, posee apres le bouton. */
  signature?: string;
};

export function enveloppe({ paragraphes, bouton, signature }: EmailHtml): string {
  const corps = paragraphes
    .map((p) => {
      /* Une ligne qui commence par un tiret devient une puce. */
      if (p.split("\n").every((l) => l.startsWith("- "))) {
        const items = p
          .split("\n")
          .map(
            (l) =>
              `<li style="margin:0 0 8px;padding:0">${lier(l.slice(2))}</li>`,
          )
          .join("");
        return `<ul style="margin:0 0 18px;padding:0 0 0 20px;color:${GRIS};font-size:15px;line-height:1.55">${items}</ul>`;
      }
      return `<p style="margin:0 0 18px;color:${GRIS};font-size:15px;line-height:1.6">${lier(p).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");

  const cta = bouton
    ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 22px">
        <tr><td style="border-radius:10px;background:${BLEU}">
          <a href="${bouton.url}" style="display:inline-block;padding:12px 22px;font-family:${POLICE};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:-.01em">${echapper(bouton.libelle)}</a>
        </td></tr>
      </table>`
    : "";

  const fin = signature
    ? `<p style="margin:0 0 18px;color:${GRIS};font-size:15px;line-height:1.6">${lier(signature).replace(/\n/g, "<br>")}</p>`
    : "";

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:${FOND}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${FOND};padding:28px 12px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:560px;max-width:100%;background:#ffffff;border:1px solid ${LIGNE};border-radius:16px">
        <tr><td style="padding:26px 30px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="padding-right:10px">${logo()}</td>
            <td style="font-family:${POLICE};font-size:16px;font-weight:600;color:${INK};letter-spacing:-.02em">NativeSquare</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:22px 30px 0;font-family:${POLICE}">
          ${corps}
          ${cta}
          ${fin}
        </td></tr>
        <tr><td style="padding:0 30px 26px">
          <div style="border-top:1px solid ${LIGNE};padding-top:16px;font-family:${POLICE};font-size:12.5px;line-height:1.5;color:${GRIS_CLAIR}">
            You're getting this because you booked a call with NativeSquare.<br>
            Questions before we talk? Just reply to this email.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
