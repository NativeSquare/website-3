import { NextResponse } from "next/server";
import { empreinte, NOM_COOKIE } from "../../../lib/interne";

/* Entree de la page interne : un mot de passe partage, pas de compte. Le cookie
   garde l'empreinte du mot de passe, jamais le mot de passe lui-meme. */
export async function POST(requete: Request) {
  const { motDePasse } = (await requete.json()) as { motDePasse?: string };
  const attendu = process.env.INTERNE_MOT_DE_PASSE;

  if (!attendu) {
    return NextResponse.json({ erreur: "INTERNE_MOT_DE_PASSE absent" }, { status: 500 });
  }
  if (!motDePasse || motDePasse !== attendu) {
    return NextResponse.json({ erreur: "Mot de passe invalide" }, { status: 401 });
  }

  const reponse = NextResponse.json({ ok: true });
  reponse.cookies.set(NOM_COOKIE, await empreinte(attendu), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return reponse;
}
