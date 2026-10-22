import { v } from "convex/values";
import { internalAction } from "./_generated/server";

/**
 * L'abonnement au webhook Calendly : Calendly appelle `/calendly/booking` a
 * chaque reservation et chaque annulation. Se cree une fois, par la ligne de
 * commande, sans que le jeton passe ailleurs que dans l'environnement Convex :
 *
 *   npx convex env set CALENDLY_TOKEN <jeton d'acces personnel Calendly>
 *   npx convex run calendly:creerAbonnement '{"url":"https://whimsical-cormorant-867.eu-west-1.convex.site/calendly/booking"}'
 *   npx convex run calendly:abonnements
 *
 * `CALENDLY_SIGNING_KEY` (la cle qui signe les messages) est lue par la route et
 * donnee a Calendly a la creation de l'abonnement.
 * Les webhooks demandent une offre Standard ou plus et l'API v2.
 * Doc : https://developer.calendly.com/api-docs/c1ddc06ce1f1b-create-webhook-subscription
 */

const API = "https://api.calendly.com";

async function appeler(
  chemin: string,
  jeton: string,
  options: { method?: string; corps?: unknown } = {},
): Promise<{ statut: number; json: unknown; texte: string }> {
  const reponse = await fetch(`${API}${chemin}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${jeton}`,
      ...(options.corps ? { "Content-Type": "application/json" } : {}),
    },
    body: options.corps ? JSON.stringify(options.corps) : undefined,
  });
  const texte = await reponse.text();
  let json: unknown = null;
  try {
    json = JSON.parse(texte);
  } catch {
    /* Reponse qui n'est pas du JSON : on garde le texte. */
  }
  return { statut: reponse.status, json, texte };
}

type Moi = { resource?: { uri?: string; current_organization?: string } };

export const creerAbonnement = internalAction({
  args: { url: v.string() },
  returns: v.object({ ok: v.boolean(), detail: v.string() }),
  handler: async (_ctx, { url }) => {
    const jeton = process.env.CALENDLY_TOKEN;
    const cle = process.env.CALENDLY_SIGNING_KEY;
    if (!jeton || !cle) {
      return { ok: false, detail: "CALENDLY_TOKEN ou CALENDLY_SIGNING_KEY absent de l'environnement Convex" };
    }
    const moi = await appeler("/users/me", jeton);
    const organisation = (moi.json as Moi | null)?.resource?.current_organization;
    if (moi.statut !== 200 || !organisation) {
      return { ok: false, detail: `users/me a repondu ${moi.statut}: ${moi.texte.slice(0, 300)}` };
    }
    const abonnement = await appeler("/webhook_subscriptions", jeton, {
      method: "POST",
      corps: {
        url,
        events: ["invitee.created", "invitee.canceled"],
        organization: organisation,
        scope: "organization",
        signing_key: cle,
      },
    });
    if (abonnement.statut !== 201) {
      return {
        ok: false,
        detail: `webhook_subscriptions a repondu ${abonnement.statut}: ${abonnement.texte.slice(0, 400)}`,
      };
    }
    const ressource = (abonnement.json as { resource?: { uri?: string; state?: string } } | null)?.resource;
    return { ok: true, detail: `abonnement cree : ${ressource?.uri ?? "?"} (etat : ${ressource?.state ?? "?"})` };
  },
});

export const abonnements = internalAction({
  args: {},
  returns: v.array(v.object({ uri: v.string(), url: v.string(), etat: v.string(), evenements: v.array(v.string()) })),
  handler: async () => {
    const jeton = process.env.CALENDLY_TOKEN;
    if (!jeton) throw new Error("CALENDLY_TOKEN absent de l'environnement Convex");
    const moi = await appeler("/users/me", jeton);
    const organisation = (moi.json as Moi | null)?.resource?.current_organization;
    if (moi.statut !== 200 || !organisation) {
      throw new Error(`users/me a repondu ${moi.statut}: ${moi.texte.slice(0, 300)}`);
    }
    const liste = await appeler(
      `/webhook_subscriptions?organization=${encodeURIComponent(organisation)}&scope=organization`,
      jeton,
    );
    if (liste.statut !== 200) {
      throw new Error(`webhook_subscriptions a repondu ${liste.statut}: ${liste.texte.slice(0, 300)}`);
    }
    const collection = (liste.json as {
      collection?: Array<{ uri?: string; callback_url?: string; state?: string; events?: string[] }>;
    } | null)?.collection ?? [];
    return collection.map((a) => ({
      uri: a.uri ?? "?",
      url: a.callback_url ?? "?",
      etat: a.state ?? "?",
      evenements: a.events ?? [],
    }));
  },
});
