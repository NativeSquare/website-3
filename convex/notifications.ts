import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * L'alerte Slack de chaque lead : quand il laisse ses coordonnees, quand il a
 * repondu aux questions, quand il reserve. C'est ce qui permet d'appeler tout
 * de suite quelqu'un qui n'est pas alle jusqu'au calendrier.
 *
 * Webhook entrant Slack : https://api.slack.com/messaging/webhooks
 * Sans SLACK_LEADS_WEBHOOK dans l'environnement Convex, l'action ne fait rien
 * et le dit dans les logs : le formulaire ne depend jamais de Slack.
 */

/* Slack lit &, < et > dans le texte comme du balisage. */
function echapper(texte: string): string {
  return texte.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

    const titres = {
      contact: "New HVAC lead, left their contact info",
      complet: "Lead answered the questions, no call booked yet",
      reserve: "Call booked",
    };
    const lignes = [
      `*${titres[args.moment]}*`,
      `${echapper([lead.prenom, lead.nom].filter(Boolean).join(" "))} | ${echapper(lead.telephone)} | ${echapper(lead.email)}`,
      `Texts OK: ${lead.consentSms ? "yes" : "no"}`,
    ];

    if (args.moment !== "contact" && lead.chiffreAffaires) {
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
    if (args.moment === "reserve" && args.debut) {
      lignes.push(`Call at ${echapper(args.debut)}`);
    }
    lignes.push(`From ad: ${echapper(visite?.utmContent ?? "unknown (no UTM on the visit)")}`);

    const reponse = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: lignes.join("\n") }),
    });
    if (!reponse.ok) {
      console.error("[slack] refuse", reponse.status, (await reponse.text()).slice(0, 300));
    }
    return null;
  },
});
