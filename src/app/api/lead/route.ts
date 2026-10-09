import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ConvexHttpClient } from "convex/browser";
import { isValidPhoneNumber } from "libphonenumber-js/min";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import {
  CHIFFRES_AFFAIRES,
  DELAIS,
  ROLES,
  SOURCES_CHANTIERS,
} from "../../(landing)/formulaire";

/**
 * Le formulaire de la landing des pubs, en deux temps. Le navigateur parle a
 * cette route, pas a Convex : le secret partage reste cote serveur, comme pour
 * `/api/visite`.
 *
 * Temps 1 : prenom, nom, telephone, e-mail. Le lead est enregistre tout de suite.
 * Temps 2 : les questions, et l'identifiant d'evenement du Lead Meta.
 *
 * Meme principe que partout ailleurs sur le site : si la base ne repond pas,
 * on le dit au navigateur, qui laisse quand meme la personne reserver.
 */

const COOKIE_VISITE = "ns_visite";

function texte(valeur: unknown, max: number): string {
  return typeof valeur === "string" ? valeur.trim().slice(0, max) : "";
}

function dans<T extends string>(liste: readonly T[], valeur: unknown): T | undefined {
  return liste.find((x) => x === valeur);
}

function refuser(erreur: string) {
  return NextResponse.json({ ok: false, erreur }, { status: 400 });
}

export async function POST(requete: Request) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.MOTEUR_SECRET;
  if (!url || !secret) {
    return NextResponse.json({ ok: false, mesure: false });
  }

  let corps: Record<string, unknown>;
  try {
    corps = (await requete.json()) as Record<string, unknown>;
  } catch {
    return refuser("Invalid request.");
  }

  /* Champ cache que seul un robot remplit : on repond comme si tout allait bien. */
  if (texte(corps.fax, 100)) return NextResponse.json({ ok: true });

  const convex = new ConvexHttpClient(url);

  try {
    if (corps.etape === 1) {
      const prenom = texte(corps.prenom, 60);
      const nom = texte(corps.nom, 60);
      const telephone = texte(corps.telephone, 30);
      const email = texte(corps.email, 120).toLowerCase();

      if (!prenom) return refuser("Please enter your first name.");
      if (!nom) return refuser("Please enter your last name.");
      /* Le formulaire envoie le numero au format international (+1305...). */
      if (!telephone.startsWith("+") || !isValidPhoneNumber(telephone)) {
        return refuser("Please enter a valid mobile number.");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return refuser("Please enter a valid email.");
      }

      const boite = await cookies();
      const jeton = crypto.randomUUID();
      const leadId = await convex.mutation(api.leads.contact, {
        secret,
        visiteId: boite.get(COOKIE_VISITE)?.value,
        prenom,
        nom,
        telephone,
        consentSms: corps.consentSms === true,
        email,
        jeton,
      });
      return NextResponse.json({ ok: true, leadId, jeton });
    }

    if (corps.etape === 2) {
      const sources = Array.isArray(corps.sources)
        ? corps.sources.map((s) => dans(SOURCES_CHANTIERS, s)).filter((s) => s !== undefined)
        : [];
      const chiffreAffaires = dans(CHIFFRES_AFFAIRES, corps.chiffreAffaires);
      const delai = dans(DELAIS, corps.delai);
      const role = dans(ROLES, corps.role);
      const leadId = texte(corps.leadId, 60);
      const jeton = texte(corps.jeton, 60);

      if (!leadId || !jeton) return refuser("Invalid request.");
      if (!sources.length || !chiffreAffaires || !delai || !role) {
        return refuser("Please answer every question.");
      }

      const eventId = await convex.mutation(api.leads.reponses, {
        secret,
        leadId: leadId as Id<"leads">,
        jeton,
        sourcesChantiers: sources,
        chiffreAffaires,
        delai,
        role,
        siteWeb: texte(corps.siteWeb, 200) || undefined,
      });
      return NextResponse.json({ ok: eventId !== null, eventId });
    }

    return refuser("Invalid request.");
  } catch (erreur) {
    console.error("[lead] ecriture impossible", erreur);
    return NextResponse.json({ ok: false, mesure: false }, { status: 502 });
  }
}
