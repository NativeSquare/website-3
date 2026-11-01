import { v } from "convex/values";
import { internalAction } from "./_generated/server";
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
