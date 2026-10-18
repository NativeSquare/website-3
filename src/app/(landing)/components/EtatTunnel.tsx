"use client";

import { createContext, useCallback, useContext, useState } from "react";

/**
 * Ou en est la personne dans le tunnel. La page autour du formulaire s'adapte :
 *   - des que la premiere question est repondue, les avis disparaissent : la
 *     personne n'a plus qu'a repondre aux questions, puis a reserver (demande
 *     d'Alexandre, 18/10/2026). Le drapeau reste leve meme si elle revient a la
 *     premiere question ;
 *   - a l'ecran du contact, l'accroche du haut change et ne laisse qu'une chose
 *     a faire : donner ses coordonnees. Les sessions montraient des visiteurs
 *     qui arrivent a cet ecran et repartent sans les laisser ;
 *   - sur les ecrans de qualification qui suivent, le haut de la page se reduit
 *     a une ligne : rester concentre sur les reponses ;
 *   - au calendrier, il n'y a plus de haut de page du tout : « Pick a time » et
 *     le calendrier, rien d'autre.
 */

type Progres = {
  engage: boolean;
  /* La personne est sur l'ecran du contact. */
  contact: boolean;
  /* Elle est sur l'un des ecrans de qualification, apres le contact. */
  questions: boolean;
  /* Elle a fini les questions : le calendrier est affiche. */
  calendrier: boolean;
  /* Sa zone, telle que saisie. */
  zone: string;
};

type Etat = Progres & { signaler: (p: Partial<Progres>) => void };

const Contexte = createContext<Etat>({
  engage: false,
  contact: false,
  questions: false,
  calendrier: false,
  zone: "",
  signaler: () => {},
});

export function TunnelProvider({ children }: { children: React.ReactNode }) {
  const [progres, setProgres] = useState<Progres>({
    engage: false,
    contact: false,
    questions: false,
    calendrier: false,
    zone: "",
  });
  const signaler = useCallback((p: Partial<Progres>) => {
    setProgres((a) => {
      const suivant = { ...a, ...p, engage: a.engage || p.engage === true };
      const inchange =
        suivant.engage === a.engage &&
        suivant.contact === a.contact &&
        suivant.questions === a.questions &&
        suivant.calendrier === a.calendrier &&
        suivant.zone === a.zone;
      return inchange ? a : suivant;
    });
  }, []);
  return <Contexte.Provider value={{ ...progres, signaler }}>{children}</Contexte.Provider>;
}

export function useTunnel() {
  return useContext(Contexte);
}

/* Ce qu'il enveloppe n'est plus affiche une fois le tunnel commence. */
export function MasquerQuandEngage({ children }: { children: React.ReactNode }) {
  const { engage } = useTunnel();
  return engage ? null : <>{children}</>;
}
