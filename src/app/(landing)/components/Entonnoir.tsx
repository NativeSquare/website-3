"use client";

import { useEffect, useRef, useState } from "react";
import CalendrierInline from "./CalendrierInline";
import FormulaireLead, { type LeadQualifie } from "./FormulaireLead";

/**
 * Le tunnel de la landing, en une colonne : les questions, un ecran chacune,
 * puis le calendrier qui n'apparait qu'une fois la derniere repondue, prerempli
 * avec le prenom et l'e-mail. Apres la reservation, le calendrier renvoie vers
 * la page pre-appel.
 *
 * Le calendrier survit a un rechargement : le lead qui l'a ouvert est garde
 * dans l'onglet, sinon la personne repartirait des questions.
 */

type Props = {
  source: string;
  boutonContact: string;
  boutonFinal: string;
  consentement: string;
  zoneOuverte: string;
  reserverTitre: string;
  reserverTexte: string;
  apresReservation: string;
};

const CLE_CALENDRIER = "ns_cal";

export default function Entonnoir({
  source,
  boutonContact,
  boutonFinal,
  consentement,
  zoneOuverte,
  reserverTitre,
  reserverTexte,
  apresReservation,
}: Props) {
  const [lead, setLead] = useState<LeadQualifie | null>(null);
  const bloc = useRef<HTMLDivElement>(null);

  /* Lecture du stockage de l'onglet apres l'affichage : synchronisation avec un
     systeme externe, que le rendu serveur ne peut pas faire. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const brut = sessionStorage.getItem(CLE_CALENDRIER);
      if (!brut) return;
      const s = JSON.parse(brut) as Partial<LeadQualifie>;
      if (typeof s.prenom === "string" && typeof s.email === "string") {
        setLead({
          prenom: s.prenom,
          email: s.email,
          role: typeof s.role === "string" ? s.role : "",
          chiffreAffaires: typeof s.chiffreAffaires === "string" ? s.chiffreAffaires : "",
        });
      }
    } catch {
      /* Stockage refuse : on repart des questions. */
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (lead) bloc.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [lead]);

  function terminer(l: LeadQualifie) {
    try {
      sessionStorage.setItem(CLE_CALENDRIER, JSON.stringify(l));
    } catch {
      /* Le calendrier s'affiche quand meme. */
    }
    setLead(l);
  }

  return (
    <div className="ld-funnel">
      {!lead && (
        <FormulaireLead
          source={source}
          boutonContact={boutonContact}
          boutonFinal={boutonFinal}
          consentement={consentement}
          zoneOuverte={zoneOuverte}
          onComplete={terminer}
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
            reponses={{ role: lead.role, chiffreAffaires: lead.chiffreAffaires }}
            apresReservation={apresReservation}
          />
        </div>
      )}
    </div>
  );
}
