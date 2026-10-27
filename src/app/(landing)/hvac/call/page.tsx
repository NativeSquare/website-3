import type { Metadata } from "next";
import { Suspense } from "react";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import CalendrierInline from "../../components/CalendrierInline";
import SuiviRelance from "../../components/SuiviRelance";

/* L'ecran de fin du formulaire instantane Meta renvoie ici : le calendrier
   Cal.com dans notre page, et non le lien Cal.com nu. C'est ce qui permet de
   renvoyer la personne vers /before-our-call une fois le rendez-vous pris :
   la redirection d'un evenement Cal.com est reservee aux offres Equipes, alors
   que l'embed previent la page quand la reservation reussit (voir
   CalendrierInline).

   Le nom est prerempli (« You ») : Cal.com impose un nom, et le lead l'a deja
   donne a Meta. Il ne reste que l'e-mail a taper ; la reservation est ensuite
   rattachee au lead par cet e-mail (convex/http.ts, /cal/booking).

   Quand l'adresse porte `?r=` (les liens des messages de relance), on retrouve
   le lead : son prenom et son e-mail sont deja dans le calendrier, il n'a rien
   a taper, et la reservation se rattache a coup sur a sa fiche.
   URL : /hvac/call?utm_source=meta&utm_medium=paid&utm_campaign=hvac-leads-2026-10
   Non indexee : c'est un tunnel. */

export const metadata: Metadata = {
  title: "Book your consultation · NativeSquare",
  robots: { index: false, follow: false },
};

/* Le lead derriere `?r=`, ou rien : un identifiant inconnu, un secret absent ou
   une base qui ne repond pas laissent le calendrier tel qu'avant. */
async function leadDuLien(r: string | undefined): Promise<{ prenom: string; email: string } | null> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  const secret = process.env.MOTEUR_SECRET;
  if (!r || !url || !secret) return null;
  try {
    return await new ConvexHttpClient(url).query(api.relance.pourReservation, {
      secret,
      r: r.trim().slice(0, 64),
    });
  } catch (erreur) {
    console.error("[hvac/call] lead du lien introuvable", erreur);
    return null;
  }
}

export default async function ReserverPage({
  searchParams,
}: {
  searchParams: Promise<{ r?: string | string[] }>;
}) {
  const { r } = await searchParams;
  const lead = await leadDuLien(Array.isArray(r) ? r[0] : r);
  const prenom = lead?.prenom.trim();
  const nom = prenom && !/^there$/i.test(prenom) ? prenom : "You";

  return (
    <section className="ld-section ld-reserver">
      <div className="ld-wrap">
        <div className="ld-calbloc">
          <h2>Pick a time for your call 📅</h2>
          <p>
            {lead
              ? "Choose a slot for your 30-minute video consultation. Your details are already filled in."
              : "Choose a slot for your 30-minute video consultation, then enter your email to confirm."}
          </p>
          <CalendrierInline
            source="landing-hvac-form"
            prefill={{ name: nom, email: lead?.email ?? "" }}
            apresReservation="/before-our-call"
          />
        </div>
      </div>
      {/* `?r=` : l'identifiant du lead, pose par les messages de relance et par le guide. */}
      <Suspense fallback={null}>
        <SuiviRelance page="reservation" />
      </Suspense>
    </section>
  );
}
