/**
 * Les parametres des evenements « Lead » et « Schedule » envoyes a Meta, les
 * memes du navigateur (pixel) et du serveur (API Conversions), pour que les
 * deux decrivent la meme personne et que le dedoublonnage reste propre.
 *
 * Depuis le retour d'Angelo du 09/10/2026, le tunnel pose d'abord deux
 * questions faciles (combien de chantiers, quelle zone), puis le contact :
 *   - « Lead » part au contact, avec la capacite en chantiers ;
 *   - « Schedule » part a la reservation, avec le role et le chiffre
 *     d'affaires, que les questions de qualification ont deja recueillis.
 * Le role sert a creer dans Events Manager une conversion personnalisee
 * (« decision_maker egal yes ») sur les appels reserves par des proprietaires
 * ou associes. Meta ne propose, dans la regle d'une conversion personnalisee,
 * que les parametres qu'il a deja recus : ils doivent donc partir avant qu'on
 * puisse creer la regle.
 * Doc : https://www.facebook.com/business/help/780705975381000
 */

/* L'identifiant d'evenement du Lead, partage entre le pixel et l'API
   Conversions : Meta ne compte qu'un Lead des deux. */
export function idEvenementLead(leadId: string): string {
  return `lead-${leadId}`;
}

export type ParametresLead = {
  content_name: string;
  jobs_capacity: string;
};

export function parametresLead(capacite: string | undefined): ParametresLead {
  return {
    content_name: "hvac-application",
    jobs_capacity: capacite ?? "",
  };
}

export type ParametresSchedule = {
  content_name: string;
  role?: string;
  revenue?: string;
  decision_maker?: "yes" | "no";
};

/* Sans reponses de qualification (reservation qui ne vient pas du tunnel HVAC,
   landing des fenetres), l'evenement garde sa forme d'avant. */
export function parametresSchedule(
  role?: string,
  revenue?: string,
): ParametresSchedule {
  if (role === undefined && revenue === undefined) {
    return { content_name: "discovery-call" };
  }
  return {
    content_name: "discovery-call",
    role: role ?? "",
    revenue: revenue ?? "",
    decision_maker: role === "Owner" || role === "Partner" ? "yes" : "no",
  };
}
