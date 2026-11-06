import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { envoyerSmsGhl } from "./envoi";

/* Essai d'envoi par HighLevel, a lancer a la main avant de passer SMS_CANAL a « ghl » :
   npx convex run sms:essaiGhl '{"a":"+1...","texte":"..."}' */
export const essaiGhl = internalAction({
  args: { a: v.string(), texte: v.string() },
  returns: v.string(),
  handler: async (_ctx, { a, texte }) => {
    await envoyerSmsGhl(a, texte);
    return "envoye par HighLevel";
  },
});

/* Un texto unique, envoye par HighLevel a l'instant donne (ms depuis 1970). Le
   planificateur de Convex le garde : rien ne depend d'un ordinateur allume.
   npx convex run sms:programmer '{"a":"+1...","texte":"...","quand":1793975400000}' */
export const programmer = internalMutation({
  args: { a: v.string(), texte: v.string(), quand: v.number() },
  returns: v.string(),
  handler: async (ctx, { a, texte, quand }): Promise<string> => {
    const id = await ctx.scheduler.runAt(quand, internal.sms.essaiGhl, { a, texte });
    return `programme pour ${new Date(quand).toISOString()} (${id})`;
  },
});
