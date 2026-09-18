import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { accesRequete } from "../../../lib/interne";

/* Cree la reservation chez Cal.com (qui envoie sa confirmation au prospect),
   puis demarre la sequence post-booking dans Convex avec ce que Cal.com ne
   connait pas : le portable, le fuseau et la phrase notee pendant l'appel.
   Doc : https://cal.com/docs/api-reference/v2/bookings/create-a-booking */
const VERSION_BOOKINGS = "2024-08-13";

type Corps = {
  prenom: string;
  nom?: string;
  email: string;
  telephone?: string;
  entreprise?: string;
  note?: string;
  fuseau: string;
  debut: string;
};

export async function POST(requete: Request) {
  if (!(await accesRequete(requete))) {
    return NextResponse.json({ erreur: "acces refuse" }, { status: 401 });
  }

  const cle = process.env.CAL_API_KEY;
  const utilisateur = process.env.CAL_USERNAME;
  const evenement = process.env.CAL_EVENT_TYPE_SLUG;
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.MOTEUR_SECRET;
  if (!cle || !utilisateur || !evenement || !convexUrl || !secret) {
    return NextResponse.json({ erreur: "configuration incomplete" }, { status: 500 });
  }

  const c = (await requete.json()) as Corps;
  if (!c.prenom || !c.email || !c.debut || !c.fuseau) {
    return NextResponse.json({ erreur: "champs manquants" }, { status: 400 });
  }

  const nomComplet = [c.prenom, c.nom].filter(Boolean).join(" ");
  const reponseCal = await fetch("https://api.cal.com/v2/bookings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cle}`,
      "cal-api-version": VERSION_BOOKINGS,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      start: new Date(c.debut).toISOString(),
      eventTypeSlug: evenement,
      username: utilisateur,
      attendee: {
        name: nomComplet,
        email: c.email,
        timeZone: c.fuseau,
        ...(c.telephone ? { phoneNumber: c.telephone } : {}),
      },
      ...(c.entreprise ? { metadata: { entreprise: c.entreprise.slice(0, 40) } } : {}),
    }),
  });

  const brut = await reponseCal.text();
  if (!reponseCal.ok) {
    return NextResponse.json(
      { erreur: `Cal.com ${reponseCal.status}`, detail: brut.slice(0, 500) },
      { status: 502 },
    );
  }

  const reservation = JSON.parse(brut) as {
    data?: { uid?: string; meetingUrl?: string; location?: string; start?: string };
  };
  const uid = reservation.data?.uid;
  if (!uid) {
    return NextResponse.json({ erreur: "Cal.com n'a pas renvoye d'identifiant" }, { status: 502 });
  }

  /* La sequence part d'ici : le webhook Cal.com, lui, ne porte ni le portable
     ni la note. */
  const convex = new ConvexHttpClient(convexUrl);
  const { etapes } = await convex.mutation(api.sequence.demarrer, {
    secret,
    calUid: uid,
    prenom: c.prenom,
    nom: c.nom,
    email: c.email,
    telephone: c.telephone,
    entreprise: c.entreprise,
    note: c.note,
    fuseau: c.fuseau,
    debut: reservation.data?.start ?? new Date(c.debut).toISOString(),
    lienVisio: reservation.data?.meetingUrl ?? reservation.data?.location,
  });

  return NextResponse.json({ uid, etapes });
}
