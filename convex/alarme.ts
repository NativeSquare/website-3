import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { alexandreDort } from "../src/lib/relance";

/**
 * Le reveil d'Alexandre : quand un lead laisse ses coordonnees pendant qu'il
 * dort (23 h a 9 h a Paris), son telephone sonne en boucle jusqu'a ce qu'il
 * appuie sur « Acknowledge » dans l'app Pushover.
 * L'objectif : appeler dans les 5 minutes, que le lead ait reserve ou non.
 *
 * Priorite 2 de Pushover (« emergency ») : la notification est renvoyee toutes
 * les `retry` secondes tant qu'elle n'est pas acquittee, jusqu'a `expire`
 * secondes, et Pushover plafonne a 50 renvois. Doc : https://pushover.net/api
 *
 * Sans PUSHOVER_USER et PUSHOVER_TOKEN dans l'environnement Convex, l'action ne
 * fait rien et le dit dans les logs : le formulaire ne depend jamais du reveil.
 * PUSHOVER_SON change le son (defaut « persistent », long) ; ALARME_DEBUT et
 * ALARME_FIN changent la plage (23 et 9 par defaut). Cette plage est a part de
 * SOMMEIL_DEBUT et SOMMEIL_FIN, qui reglent le mode dodo des relances (23 h a 8 h).
 */

const URL_PUSHOVER = "https://api.pushover.net/1/messages.json";
/* Le minimum que Pushover accepte entre deux renvois. */
const RENVOI_SECONDES = 30;
/* 50 renvois a 30 s = 25 min ; Pushover arrete la, quoi qu'on demande ensuite. */
const EXPIRE_SECONDES = 30 * 60;

async function sonner(titre: string, message: string): Promise<{ ok: boolean; detail: string }> {
  const user = process.env.PUSHOVER_USER;
  const token = process.env.PUSHOVER_TOKEN;
  if (!user || !token) {
    console.log("[alarme] PUSHOVER_USER ou PUSHOVER_TOKEN absent : alarme non envoyee");
    return { ok: false, detail: "cles Pushover absentes de l'environnement Convex" };
  }
  const corps = new URLSearchParams({
    token,
    user,
    title: titre,
    message,
    priority: "2",
    retry: String(RENVOI_SECONDES),
    expire: String(EXPIRE_SECONDES),
    sound: process.env.PUSHOVER_SON ?? "persistent",
  });
  const reponse = await fetch(URL_PUSHOVER, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: corps.toString(),
  });
  const texte = (await reponse.text()).slice(0, 300);
  if (!reponse.ok) {
    console.error("[alarme] Pushover refuse", reponse.status, texte);
    return { ok: false, detail: `Pushover ${reponse.status} : ${texte}` };
  }
  return { ok: true, detail: texte };
}

/* Un lead vient d'arriver (formulaire de la landing ou formulaire Meta). Pas
   d'alarme le jour, ni pour le formulaire general. */
export const reveiller = internalAction({
  args: { leadId: v.id("leads") },
  returns: v.null(),
  handler: async (ctx, { leadId }) => {
    const dort = alexandreDort(
      Date.now(),
      Number(process.env.ALARME_DEBUT ?? 23),
      Number(process.env.ALARME_FIN ?? 9),
    );
    if (!dort) return null;

    const lead = await ctx.runQuery(internal.leads.parId, { leadId });
    if (!lead || lead.variante === "general") return null;

    const nom = [lead.prenom, lead.nom].filter(Boolean).join(" ");
    const lignes = [
      `${nom} | ${lead.telephone}`,
      `Jobs/month: ${lead.capacite ?? "?"} | Area: ${lead.zone ?? "?"}`,
      "Call within 5 minutes.",
    ];
    const resultat = await sonner(`New lead: ${lead.prenom}`, lignes.join("\n"));
    console.log("[alarme] lead", leadId, resultat.ok ? "alarme envoyee" : "echec", resultat.detail);
    return null;
  },
});

/* Pour voir et entendre l'alarme sans creer de lead, a toute heure :
   npx convex run alarme:tester */
export const tester = internalAction({
  args: {},
  returns: v.string(),
  handler: async () => {
    const resultat = await sonner(
      "TEST : New lead: Jean",
      "Jean Test | +15555550100\nJobs/month: 11_to_25_jobs_a_month | Area: 33309\nCall within 5 minutes.",
    );
    return resultat.ok ? `alarme de test envoyee : ${resultat.detail}` : `echec : ${resultat.detail}`;
  },
});
