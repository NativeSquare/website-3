/**
 * Les parametres de l'evenement « Lead » envoye a Meta, les memes du navigateur
 * (pixel) et du serveur (API Conversions), pour que les deux decrivent le meme
 * lead et que le dedoublonnage reste propre.
 *
 * Le role et le chiffre d'affaires servent a creer dans Events Manager une
 * conversion personnalisee (« decision_maker egal yes ») et a optimiser les
 * pubs sur les proprietaires et associes seulement. Meta ne propose, dans la
 * regle d'une conversion personnalisee, que les parametres qu'il a deja recus :
 * ils doivent donc partir avant qu'on puisse creer la regle.
 * Doc : https://www.facebook.com/business/help/780705975381000
 */

export type ParametresLead = {
  content_name: string;
  role: string;
  revenue: string;
  decision_maker: "yes" | "no";
};

export function parametresLead(
  role: string | undefined,
  revenue: string | undefined,
): ParametresLead {
  return {
    content_name: "hvac-application",
    role: role ?? "",
    revenue: revenue ?? "",
    decision_maker: role === "Owner" || role === "Partner" ? "yes" : "no",
  };
}
