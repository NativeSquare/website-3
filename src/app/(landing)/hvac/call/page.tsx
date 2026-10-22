import type { Metadata } from "next";
import CalendrierInline from "../../components/CalendrierInline";

/* L'ecran de fin du formulaire instantane Meta renvoie ici : le calendrier
   Cal.com dans notre page, et non le lien Cal.com nu. C'est ce qui permet de
   renvoyer la personne vers /before-our-call une fois le rendez-vous pris :
   la redirection d'un evenement Cal.com est reservee aux offres Equipes, alors
   que l'embed previent la page quand la reservation reussit (voir
   CalendrierInline).

   Le nom est prerempli (« You ») : Cal.com impose un nom, et le lead l'a deja
   donne a Meta. Il ne reste que l'e-mail a taper ; la reservation est ensuite
   rattachee au lead par cet e-mail (convex/http.ts, /cal/booking).
   URL : /hvac/call?utm_source=meta&utm_medium=paid&utm_campaign=hvac-leads-2026-10
   Non indexee : c'est un tunnel. */

export const metadata: Metadata = {
  title: "Book your consultation · NativeSquare",
  robots: { index: false, follow: false },
};

export default function ReserverPage() {
  return (
    <section className="ld-section ld-reserver">
      <div className="ld-wrap">
        <div className="ld-calbloc">
          <h2>Pick a time for your call 📅</h2>
          <p>
            Choose a slot for your 30-minute video consultation, then enter your
            email to confirm.
          </p>
          <CalendrierInline
            source="landing-hvac-form"
            prefill={{ name: "You", email: "" }}
            apresReservation="/before-our-call"
          />
        </div>
      </div>
    </section>
  );
}
