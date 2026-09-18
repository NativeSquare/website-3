import { cookies } from "next/headers";

/* Acces a la page interne de reservation. Un mot de passe partage suffit : la
   page ne montre aucune donnee client, elle sert a creer un rendez-vous. */

export const NOM_COOKIE = "ns_interne";

export async function empreinte(valeur: string): Promise<string> {
  const brut = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`ns-interne:${valeur}`),
  );
  return Array.from(new Uint8Array(brut))
    .map((o) => o.toString(16).padStart(2, "0"))
    .join("");
}

export async function acces(): Promise<boolean> {
  const attendu = process.env.INTERNE_MOT_DE_PASSE;
  if (!attendu) return false;
  const jeton = (await cookies()).get(NOM_COOKIE)?.value;
  return Boolean(jeton) && jeton === (await empreinte(attendu));
}

/* Pour les routes d'API, qui recoivent la requete au lieu du contexte. */
export async function accesRequete(requete: Request): Promise<boolean> {
  const attendu = process.env.INTERNE_MOT_DE_PASSE;
  if (!attendu) return false;
  const entete = requete.headers.get("cookie") ?? "";
  const jeton = entete
    .split(";")
    .map((morceau) => morceau.trim())
    .find((morceau) => morceau.startsWith(`${NOM_COOKIE}=`))
    ?.slice(NOM_COOKIE.length + 1);
  return Boolean(jeton) && jeton === (await empreinte(attendu));
}
