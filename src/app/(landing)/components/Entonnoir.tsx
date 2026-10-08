"use client";

import { useEffect, useRef, useState } from "react";
import CalendrierInline from "./CalendrierInline";
import FormulaireLead from "./FormulaireLead";

/**
 * Le tunnel de la landing, en une colonne : le formulaire, puis le calendrier
 * qui n'apparait qu'une fois les questions repondues, prerempli avec le nom et
 * l'e-mail. Apres la reservation, le calendrier renvoie vers la page pre-appel.
 */

type Props = {
  source: string;
  titre: string;
  boutonContact: string;
  boutonQuestions: string;
  consentement: string;
  reserverTitre: string;
  reserverTexte: string;
  apresReservation: string;
};

export default function Entonnoir({
  source,
  titre,
  boutonContact,
  boutonQuestions,
  consentement,
  reserverTitre,
  reserverTexte,
  apresReservation,
}: Props) {
  const [lead, setLead] = useState<{ prenom: string; email: string } | null>(null);
  const bloc = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lead) bloc.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [lead]);

  return (
    <div className="ld-funnel">
      {!lead && (
        <FormulaireLead
          source={source}
          titre={titre}
          boutonContact={boutonContact}
          boutonQuestions={boutonQuestions}
          consentement={consentement}
          onComplete={setLead}
        />
      )}
      {lead && (
        <div className="ld-calbloc" ref={bloc}>
          <h2>{reserverTitre}</h2>
          <p>{reserverTexte.replace("{prenom}", lead.prenom)}</p>
          <CalendrierInline
            source={source}
            ancre="book"
            prefill={{ name: lead.prenom, email: lead.email }}
            apresReservation={apresReservation}
          />
        </div>
      )}
    </div>
  );
}
