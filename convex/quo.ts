"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

/* Quo est la memoire de la campagne : les contacts y portent leurs proprietes
   (porte, ouverture, contexte, statut) et l'historique d'appels y vit. Ces
   actions sont le seul endroit qui parle a l'API Quo, avec la cle du
   deploiement. Elles sont appelees par les routes /api/interne/campagne, qui
   passent le secret partage.
   Doc : https://www.quo.com/docs/mdx/api-reference */

const BASE = "https://api.quo.com/v1";

function verifier(secret: string) {
  if (secret !== process.env.MOTEUR_SECRET) throw new Error("secret invalide");
}

function cle(): string {
  const k = process.env.QUO_API_KEY;
  if (!k) throw new Error("QUO_API_KEY absent");
  return k;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
async function quo(chemin: string, init: RequestInit = {}): Promise<any> {
  const reponse = await fetch(BASE + chemin, {
    ...init,
    headers: { Authorization: cle(), "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  const texte = await reponse.text();
  if (!reponse.ok) throw new Error(`Quo ${reponse.status} ${chemin} : ${texte.slice(0, 300)}`);
  try {
    return JSON.parse(texte);
  } catch {
    return texte;
  }
}

type Champ = { id: string; key: string; name: string; type: string };

/* Les proprietes personnalisees du workspace, par nom en minuscules. On les
   retrouve par leur nom et jamais par une cle codee en dur : les cles changent
   d'un workspace a l'autre. */
async function proprietes(): Promise<Record<string, Champ>> {
  const r = await quo("/contact-custom-fields");
  const parNom: Record<string, Champ> = {};
  for (const c of r.data ?? []) parNom[String(c.name).trim().toLowerCase()] = c;
  return parNom;
}

const texteDe = (valeur: unknown): string =>
  Array.isArray(valeur) ? valeur.join(", ") : valeur == null ? "" : String(valeur);

function lireContact(c: any) {
  const perso = (nom: string) =>
    (c.customFields ?? []).find((x: any) => String(x.name).trim().toLowerCase() === nom)?.value ?? null;
  const d = c.defaultFields ?? {};
  return {
    id: String(c.id),
    prenom: texteDe(d.firstName),
    nom: texteDe(d.lastName),
    entreprise: texteDe(d.company),
    role: texteDe(d.role),
    telephone: texteDe(d.phoneNumbers?.[0]?.value),
    ville: texteDe(perso("city")),
    site: texteDe(perso("website")),
    porte: texteDe(perso("door")),
    ouverture: texteDe(perso("opening")),
    contexte: texteDe(perso("context")),
    preuve: texteDe(perso("opening proof")),
    notes: texteDe(perso("notes")),
    avis: texteDe(perso("reviews")),
    note: texteDe(perso("rating")),
    statut: texteDe(perso("statut")),
  };
}

export type ContactCampagne = ReturnType<typeof lireContact>;

/* Tous les contacts de la campagne : ceux qui portent une phrase d'ouverture. */
export const liste = action({
  args: { secret: v.string() },
  handler: async (_ctx, args) => {
    verifier(args.secret);
    const parNom = await proprietes();
    const contacts: ContactCampagne[] = [];
    let page: string | undefined;
    for (let i = 0; i < 40; i++) {
      const q = "/contacts?maxResults=50" + (page ? "&pageToken=" + encodeURIComponent(page) : "");
      const r = await quo(q);
      for (const c of r.data ?? []) {
        const lu = lireContact(c);
        if (lu.ouverture || lu.porte) contacts.push(lu);
      }
      page = r.nextPageToken || undefined;
      if (!page) break;
    }
    return { contacts, statutDisponible: Boolean(parNom["statut"]) };
  },
});

/* L'historique d'appels de chaque numero, depuis la ligne de la campagne.
   L'API limite a 10 requetes par seconde : on avance par paquets de 8. */
export const appels = action({
  args: { secret: v.string(), numeros: v.array(v.string()) },
  handler: async (_ctx, args) => {
    verifier(args.secret);
    const lignes = await quo("/phone-numbers");
    const voulu = process.env.QUO_NUMERO;
    const ligne = (lignes.data ?? []).find((l: any) => l.number === voulu) ?? lignes.data?.[0];
    if (!ligne) throw new Error("aucune ligne Quo");

    const resultat: Record<string, { n: number; dernier: { quand: string; statut: string; duree: number; direction: string } | null }> = {};
    const numeros = [...new Set(args.numeros.filter(Boolean))];
    for (let i = 0; i < numeros.length; i += 8) {
      const paquet = numeros.slice(i, i + 8);
      await Promise.all(
        paquet.map(async (numero) => {
          try {
            const p = new URLSearchParams({ phoneNumberId: ligne.id, participants: numero, maxResults: "10" });
            const r = await quo("/calls?" + p.toString());
            const liste = (r.data ?? []) as any[];
            const dernier = liste[0];
            resultat[numero] = {
              n: liste.length,
              dernier: dernier
                ? {
                    quand: String(dernier.createdAt ?? ""),
                    statut: String(dernier.status ?? ""),
                    duree: Number(dernier.duration ?? 0),
                    direction: String(dernier.direction ?? ""),
                  }
                : null,
            };
          } catch (e) {
            resultat[numero] = { n: -1, dernier: null };
            console.error("appels", numero, String(e).slice(0, 200));
          }
        }),
      );
      if (i + 8 < numeros.length) await new Promise((r) => setTimeout(r, 1000));
    }
    return resultat;
  },
});

/* Poser un statut sur un contact, et au passage un prenom ou une note.
   PATCH remplace le contact entier : on relit, on modifie, on renvoie tout. */
export const statut = action({
  args: {
    secret: v.string(),
    id: v.string(),
    statut: v.string(),
    prenom: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    verifier(args.secret);
    const parNom = await proprietes();
    const champStatut = parNom["statut"];
    if (!champStatut) {
      throw new Error("Propriete « Statut » absente dans Quo : cree-la dans Settings > Contacts (multi-select).");
    }

    const actuel = (await quo("/contacts/" + encodeURIComponent(args.id))).data;
    const d = actuel.defaultFields ?? {};
    const existants: Array<{ key: string; value: unknown }> = (actuel.customFields ?? [])
      .filter((c: any) => c.key !== champStatut.key)
      .map((c: any) => ({ key: c.key, value: c.value ?? null }));

    const valeurStatut = champStatut.type === "multi-select" ? [args.statut] : args.statut;
    const custom = [...existants, { key: champStatut.key, value: valeurStatut }];

    if (args.note) {
      const champNotes = parNom["notes"];
      if (champNotes) {
        const ancien = texteDe((actuel.customFields ?? []).find((c: any) => c.key === champNotes.key)?.value);
        const nouveau = (args.note + (ancien ? " | " + ancien : "")).slice(0, 900);
        const i = custom.findIndex((c) => c.key === champNotes.key);
        if (i >= 0) custom[i] = { key: champNotes.key, value: nouveau };
        else custom.push({ key: champNotes.key, value: nouveau });
      }
    }

    const corps = {
      defaultFields: {
        firstName: args.prenom || d.firstName || "",
        lastName: d.lastName ?? null,
        company: d.company ?? null,
        role: d.role ?? null,
        emails: (d.emails ?? []).map((e: any) => ({ name: e.name ?? "primary", value: e.value ?? null })),
        phoneNumbers: (d.phoneNumbers ?? []).map((p: any) => ({ name: p.name ?? "primary", value: p.value ?? null })),
      },
      customFields: custom,
    };
    const r = await quo("/contacts/" + encodeURIComponent(args.id), { method: "PATCH", body: JSON.stringify(corps) });
    return lireContact(r.data);
  },
});
