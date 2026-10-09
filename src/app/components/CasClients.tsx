import LienOnePager from "../(precall)/components/LienOnePager";

/**
 * Les deux resultats clients montres sur la page pre-appel et, sans les liens
 * PDF, sous le formulaire de la landing HVAC (retour d'Angelo du 09/10/2026 :
 * des preuves a la place des etapes). Une seule liste pour les deux pages.
 *
 * Memes chiffres que la slide 7 de la video pre-call et que les one-pagers.
 * Aucun autre chiffre ni temoignage n'est a ajouter sans source.
 */

const CAS = [
  {
    id: "roofing",
    tag: "Roofing · Central Florida",
    big: "+31",
    lbl: "booked jobs in 90 days, from calls that used to go to voicemail.",
    pdf: "/precall/one-pager-roofing.pdf",
  },
  {
    id: "septic",
    tag: "Septic · Georgia",
    big: "+$94k",
    lbl: "in rebooked pumping and installs from customers they already had.",
    pdf: "/precall/one-pager-septic.pdf",
  },
];

function Croisillons() {
  return (
    <>
      <i className="x tl" />
      <i className="x tr" />
      <i className="x bl" />
      <i className="x br" />
    </>
  );
}

export default function CasClients({ avecPdf = false }: { avecPdf?: boolean }) {
  return (
    <div className="bc-cases">
      {CAS.map((c) => (
        <article key={c.id} className="bc-case corners">
          <Croisillons />
          <p className="bc-tag">{c.tag}</p>
          <p className="bc-big">{c.big}</p>
          <p className="bc-lbl">{c.lbl}</p>
          {avecPdf && (
            <LienOnePager href={c.pdf} cas={c.id} className="bc-link">
              Read the one-pager (PDF)
            </LienOnePager>
          )}
        </article>
      ))}
    </div>
  );
}
