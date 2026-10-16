import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * L'alerte Slack de chaque lead : quand il laisse ses coordonnees, quand il a
 * repondu aux questions, quand il reserve. C'est ce qui permet d'appeler tout
 * de suite quelqu'un qui n'est pas alle jusqu'au calendrier.
 *
 * Deux formulaires alimentent ces alertes : celui de la landing HVAC, et le
 * formulaire general (`/book`) des visiteurs qui ne viennent pas d'une
 * campagne. Une reservation Cal.com qui ne vient d'aucun des deux (lien direct
 * envoye par e-mail, test) a sa propre alerte : on ne la manque pas.
 *
 * Webhook entrant Slack : https://api.slack.com/messaging/webhooks
 * Sans SLACK_LEADS_WEBHOOK dans l'environnement Convex, l'action ne fait rien
 * et le dit dans les logs : le formulaire ne depend jamais de Slack.
 */

/* Slack lit &, < et > dans le texte comme du balisage. */
function echapper(texte: string): string {
  return texte.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* D'ou vient la visite : la pub si l'URL en portait une, sinon ce qu'on sait. */
function origineDeLaVisite(
  visite: { utmContent?: string; parametres?: Record<string, string> } | null,
): string {
  if (visite?.utmContent) return echapper(visite.utmContent);
  if (visite?.parametres?.fbclid) return "unknown (Facebook click, no UTM)";
  return "unknown (no UTM on the visit)";
}

async function poster(webhook: string, lignes: string[]): Promise<void> {
  const reponse = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: lignes.join("\n") }),
  });
  if (!reponse.ok) {
    console.error("[slack] refuse", reponse.status, (await reponse.text()).slice(0, 300));
  }
}

export const lead = internalAction({
  args: {
    leadId: v.id("leads"),
    moment: v.union(v.literal("contact"), v.literal("complet"), v.literal("reserve")),
    debut: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const webhook = process.env.SLACK_LEADS_WEBHOOK;
    if (!webhook) {
      console.log("[slack] SLACK_LEADS_WEBHOOK absent : alerte non envoyee");
      return null;
    }

    const lead = await ctx.runQuery(internal.leads.parId, { leadId: args.leadId });
    if (!lead) return null;
    const visite = lead.visiteId
      ? await ctx.runQuery(internal.visites.parVisiteId, { visiteId: lead.visiteId })
      : null;

    const general = lead.variante === "general";
    const titres = {
      contact: general
        ? "New lead from the booking form, left their contact info. Call them."
        : "New HVAC lead, left their contact info. Call them.",
      complet: "Lead answered the questions, no call booked yet",
      reserve: "Call booked",
    };
    const lignes = [
      `*${titres[args.moment]}*`,
      `${echapper([lead.prenom, lead.nom].filter(Boolean).join(" "))} | ${echapper(lead.telephone)} | ${echapper(lead.email)}`,
      `Texts OK: ${lead.consentSms ? "yes" : "no"}`,
    ];
    if (general) {
      if (lead.origine) lignes.push(`Found us via: ${echapper(lead.origine)}`);
    } else if (lead.capacite || lead.zone) {
      lignes.push(
        `Can take on: ${echapper(lead.capacite ?? "?")} | Area: ${echapper(lead.zone ?? "?")}`,
      );
    }

    if (args.moment !== "contact") {
      if (general && lead.activite) {
        lignes.push(
          `Wants to talk about: ${echapper((lead.motifs ?? []).join(", ") || "?")}` +
            (lead.motifNote ? ` | Note: ${echapper(lead.motifNote)}` : ""),
        );
        lignes.push(
          `Role: ${echapper(lead.role ?? "?")} | Company does: ${echapper(lead.activite)}` +
            (lead.siteWeb ? ` | Site: ${echapper(lead.siteWeb)}` : ""),
        );
      } else if (lead.chiffreAffaires) {
        lignes.push(
          [
            `Revenue: ${echapper(lead.chiffreAffaires)}`,
            `Role: ${echapper(lead.role ?? "?")}`,
            `Wants more jobs: ${echapper(lead.delai ?? "?")}`,
          ].join(" | "),
        );
        lignes.push(
          `Gets jobs from: ${echapper((lead.sourcesChantiers ?? []).join(", ") || "?")}` +
            (lead.siteWeb ? ` | Site: ${echapper(lead.siteWeb)}` : ""),
        );
      }
    }
    if (args.moment === "reserve" && args.debut) {
      lignes.push(`Call at ${echapper(args.debut)}`);
    }
    lignes.push(
      `From ad: ${origineDeLaVisite(visite)}` +
        (visite?.chemin ? ` | Landing: ${echapper(visite.chemin)}` : ""),
    );

    await poster(webhook, lignes);
    return null;
  },
});

/**
 * Une reservation Cal.com qui ne vient d'aucun formulaire : pas de telephone,
 * pas de reponses, la personne n'a rien laisse que son nom et son e-mail chez
 * Cal.com. Sans cette alerte, personne ne l'aurait su.
 */
export const reservationHorsFormulaire = internalAction({
  args: {
    nom: v.optional(v.string()),
    email: v.optional(v.string()),
    debut: v.optional(v.string()),
    visiteId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const webhook = process.env.SLACK_LEADS_WEBHOOK;
    if (!webhook) {
      console.log("[slack] SLACK_LEADS_WEBHOOK absent : alerte non envoyee");
      return null;
    }
    const visite = args.visiteId
      ? await ctx.runQuery(internal.visites.parVisiteId, { visiteId: args.visiteId })
      : null;

    const lignes = [
      "*Call booked WITHOUT the form: no phone number, no answers. Email them to learn more.*",
      `${echapper(args.nom ?? "?")} | ${echapper(args.email ?? "?")}`,
    ];
    if (args.debut) lignes.push(`Call at ${echapper(args.debut)}`);
    lignes.push(`From ad: ${origineDeLaVisite(visite)}`);

    await poster(webhook, lignes);
    return null;
  },
});
