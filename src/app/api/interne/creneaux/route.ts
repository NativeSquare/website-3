import { NextResponse } from "next/server";
import { accesRequete } from "../../../lib/interne";

/* Les creneaux libres, lus chez Cal.com avec la cle d'API cote serveur.
   Doc : https://cal.com/docs/api-reference/v2/slots/get-available-time-slots-for-an-event-type
   La version d'API est imposee par Cal.com pour ce point d'entree. */
const VERSION_SLOTS = "2024-09-04";

export async function GET(requete: Request) {
  if (!(await accesRequete(requete))) {
    return NextResponse.json({ erreur: "acces refuse" }, { status: 401 });
  }

  const cle = process.env.CAL_API_KEY;
  const utilisateur = process.env.CAL_USERNAME;
  const evenement = process.env.CAL_EVENT_TYPE_SLUG;
  if (!cle || !utilisateur || !evenement) {
    return NextResponse.json(
      { erreur: "CAL_API_KEY, CAL_USERNAME ou CAL_EVENT_TYPE_SLUG absent" },
      { status: 500 },
    );
  }

  const url = new URL(requete.url);
  const fuseau = url.searchParams.get("fuseau") ?? "America/New_York";
  const jours = Number(url.searchParams.get("jours") ?? 10);

  const debut = new Date();
  const fin = new Date(debut.getTime() + jours * 24 * 60 * 60 * 1000);

  const chez = new URL("https://api.cal.com/v2/slots");
  chez.searchParams.set("username", utilisateur);
  chez.searchParams.set("eventTypeSlug", evenement);
  chez.searchParams.set("start", debut.toISOString());
  chez.searchParams.set("end", fin.toISOString());
  chez.searchParams.set("timeZone", fuseau);

  const reponse = await fetch(chez, {
    headers: { Authorization: `Bearer ${cle}`, "cal-api-version": VERSION_SLOTS },
    cache: "no-store",
  });
  const corps = await reponse.text();
  if (!reponse.ok) {
    return NextResponse.json(
      { erreur: `Cal.com ${reponse.status}`, detail: corps.slice(0, 400) },
      { status: 502 },
    );
  }

  const donnees = JSON.parse(corps) as {
    data?: Record<string, Array<{ start: string }>>;
  };
  return NextResponse.json({ creneaux: donnees.data ?? {} });
}
