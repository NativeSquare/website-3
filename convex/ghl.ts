import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { ORIGINE_META } from "../src/lib/formulaire-meta";
import { leadDeTest } from "../src/lib/relance";
import { contactGhl, noteGhl, type ContactGhl, type LeadPourGhl } from "../src/lib/ghl-contact";

/**
 * Chaque lead de Meta Ads (formulaire instantane ou landing /hvac) devient un
 * contact HighLevel des qu'il arrive : fiche (nom, e-mail, telephone), tags
 * `meta-ads` + le chemin d'arrivee, et une note avec ses reponses. Le contact est
 * retrouve par son e-mail ou son telephone, donc le texto qui part plus tard
 * (convex/envoi.ts) tombe sur la meme fiche et non sur un doublon.
 *
 * Docs : https://marketplace.gohighlevel.com/docs/ghl/contacts/upsert-contact
 *        https://marketplace.gohighlevel.com/docs/ghl/contacts/create-note
 *
 * Sans GHL_TOKEN et GHL_LOCATION_ID dans l'environnement Convex, l'action ne fait
 * rien et le dit dans les logs : le formulaire ne depend jamais de HighLevel. Un
 * echec est retente deux fois (1 min puis 5 min), puis laisse dans les logs.
 */

const BASE = "https://services.leadconnectorhq.com";
const VERSION = "2021-07-28";
const ESSAIS_MAX = 3;
/* Attente avant le 2e puis le 3e essai. */
const ATTENTES_MS = [60 * 1000, 5 * 60 * 1000];

function identifiants(): { jeton: string; lieu: string } | null {
  const jeton = process.env.GHL_TOKEN;
  const lieu = process.env.GHL_LOCATION_ID;
  return jeton && lieu ? { jeton, lieu } : null;
}

/* Un appel a HighLevel ; une limite de debit (429) est reessayee trois fois. */
async function appeler(
  jeton: string,
  methode: "GET" | "POST" | "DELETE",
  chemin: string,
  corps?: unknown,
): Promise<Response> {
  for (let essai = 0; ; essai++) {
    const reponse = await fetch(BASE + chemin, {
      method: methode,
      headers: {
        Authorization: `Bearer ${jeton}`,
        Version: VERSION,
        Accept: "application/json",
        ...(corps === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: corps === undefined ? undefined : JSON.stringify(corps),
    });
    if (reponse.status === 429 && essai < 3) {
      await new Promise((ok) => setTimeout(ok, 1500 * (essai + 1)));
      continue;
    }
    return reponse;
  }
}

/* Cree la fiche ou retrouve celle qui existe, et rend son identifiant. Si
   HighLevel refuse le telephone, la fiche est creee sans lui plutot que perdue. */
async function creerOuRetrouverContact(
  jeton: string,
  lieu: string,
  contact: ContactGhl,
): Promise<string> {
  let reponse = await appeler(jeton, "POST", "/contacts/upsert", { locationId: lieu, ...contact });
  let texte = await reponse.text();
  if ((reponse.status === 400 || reponse.status === 422) && contact.phone && /phone/i.test(texte)) {
    console.log("[ghl] telephone refuse, la fiche est creee sans lui", texte.slice(0, 200));
    const { phone: _phone, ...sansTelephone } = contact;
    void _phone;
    reponse = await appeler(jeton, "POST", "/contacts/upsert", { locationId: lieu, ...sansTelephone });
    texte = await reponse.text();
  }
  if (!reponse.ok) throw new Error(`HighLevel contact ${reponse.status} : ${texte.slice(0, 300)}`);
  const id = (JSON.parse(texte) as { contact?: { id?: string } }).contact?.id;
  if (!id) throw new Error("HighLevel : contact sans identifiant");
  return id;
}

async function ajouterNote(jeton: string, contactId: string, texte: string): Promise<void> {
  const reponse = await appeler(jeton, "POST", `/contacts/${contactId}/notes`, { body: texte });
  if (!reponse.ok) {
    throw new Error(`HighLevel note ${reponse.status} : ${(await reponse.text()).slice(0, 300)}`);
  }
}

/* Un lead vient d'arriver : il part dans HighLevel. Pas pour le formulaire
   general (visiteurs qui ne viennent pas d'une pub), ni pour les fiches de test. */
export const pousserLead = internalAction({
  args: { leadId: v.id("leads"), essai: v.optional(v.number()) },
  returns: v.null(),
  handler: async (ctx, { leadId, essai }) => {
    const acces = identifiants();
    if (!acces) {
      console.log("[ghl] GHL_TOKEN ou GHL_LOCATION_ID absent : lead non pousse", leadId);
      return null;
    }
    const lead = await ctx.runQuery(internal.leads.parId, { leadId });
    if (!lead || lead.variante === "general" || leadDeTest(lead)) return null;
    /* Deja pousse (un second appel, un rattrapage) : rien a refaire. */
    if (lead.ghlContactId) return null;

    const numeroEssai = essai ?? 1;
    try {
      const contactId = await creerOuRetrouverContact(acces.jeton, acces.lieu, contactGhl(lead));
      await ctx.runMutation(internal.leads.lierGhl, { leadId, ghlContactId: contactId });
      console.log("[ghl] lead pousse", leadId, contactId);
      /* La note est un plus : si elle echoue, le contact est deja la et ne doit
         pas etre repousse. */
      try {
        await ajouterNote(acces.jeton, contactId, noteGhl(lead));
      } catch (erreur) {
        console.error("[ghl] note non ajoutee", leadId, erreur);
      }
    } catch (erreur) {
      console.error(`[ghl] essai ${numeroEssai}/${ESSAIS_MAX} echoue`, leadId, erreur);
      if (numeroEssai < ESSAIS_MAX) {
        await ctx.scheduler.runAfter(ATTENTES_MS[numeroEssai - 1], internal.ghl.pousserLead, {
          leadId,
          essai: numeroEssai + 1,
        });
      }
    }
    return null;
  },
});

/* Pour verifier le montage de bout en bout, sans lead : cree une fiche de test
   dans HighLevel, la relit, la supprime (sauf avec `garder`) et dit ce que
   HighLevel a garde.   npx convex run ghl:tester
                        npx convex run ghl:tester '{"garder":true}' */
const EMAIL_TEST = "ghl-push-test@nativesquare.ai";

export const tester = internalAction({
  args: { garder: v.optional(v.boolean()) },
  returns: v.string(),
  handler: async (_ctx, { garder }) => {
    const acces = identifiants();
    if (!acces) return "echec : GHL_TOKEN ou GHL_LOCATION_ID absent de l'environnement Convex";

    const faux: LeadPourGhl = {
      prenom: "Zz-Test",
      nom: "GhlPush",
      email: EMAIL_TEST,
      telephone: "+13055550147",
      capacite: "11_to_25_jobs_a_month",
      zone: "33309",
      origine: `${ORIGINE_META} | ad: TEST | form: TEST`,
    };
    const contactId = await creerOuRetrouverContact(acces.jeton, acces.lieu, contactGhl(faux));
    await ajouterNote(acces.jeton, contactId, noteGhl(faux));

    const relu = await appeler(acces.jeton, "GET", `/contacts/${contactId}`);
    const texte = await relu.text();
    if (!relu.ok) return `contact ${contactId} cree, relecture ${relu.status} : ${texte.slice(0, 200)}`;
    const c = (JSON.parse(texte) as {
      contact?: { email?: string; firstName?: string; lastName?: string; phone?: string; tags?: string[]; source?: string };
    }).contact;
    const resume = `contact ${contactId} : ${c?.firstName} ${c?.lastName}, ${c?.email}, ${c?.phone ?? "sans telephone"}, source « ${c?.source} », tags [${(c?.tags ?? []).join(", ")}]`;

    if (garder) return `${resume}. Conserve dans HighLevel.`;
    /* On ne supprime que la fiche de test, reconnue a son e-mail. */
    if (c?.email?.toLowerCase() !== EMAIL_TEST) {
      return `${resume}. Pas supprime : l'e-mail ne correspond pas a la fiche de test.`;
    }
    const suppression = await appeler(acces.jeton, "DELETE", `/contacts/${contactId}`);
    return `${resume}. ${suppression.ok ? "Fiche de test supprimee." : `Suppression refusee (${suppression.status}).`}`;
  },
});
