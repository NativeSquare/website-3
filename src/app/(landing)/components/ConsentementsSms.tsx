"use client";

/**
 * Les deux cases d'accord aux SMS, communes aux deux formulaires (`/hvac` et
 * `/book`). Depuis le 31/10/2026 (enregistrement A2P) : deux cases separees,
 * decochees d'emblee, facultatives. Reserver n'en depend jamais, et on n'envoie
 * que ce que la personne a accepte. Les textes suivent l'exemple de formulaire
 * conforme de HighLevel : qui ecrit, quel type de messages, frequence, frais,
 * HELP et STOP. Ils doivent rester alignes sur la description de la campagne.
 */

const NOM = "NativeSquare SAS";
const FIN =
  "Message frequency may vary. Message & data rates may apply. Reply HELP for help or STOP to opt out.";

export const TEXTE_NON_MARKETING = `I consent to receive non-marketing text messages from ${NOM} about my call: confirmation, the call link, reminders and material to prepare for it. ${FIN}`;
export const TEXTE_MARKETING = `I consent to receive marketing text messages from ${NOM}, such as follow-ups about booking a call, with a guide on how to get more HVAC jobs. ${FIN}`;

export default function ConsentementsSms({
  nonMarketing,
  marketing,
  onNonMarketing,
  onMarketing,
}: {
  nonMarketing: boolean;
  marketing: boolean;
  onNonMarketing: (valeur: boolean) => void;
  onMarketing: (valeur: boolean) => void;
}) {
  return (
    <fieldset className="ld-sms-groupe">
      <label className="ld-opt ld-sms">
        <input
          type="checkbox"
          name="consentSms"
          checked={nonMarketing}
          onChange={(e) => onNonMarketing(e.target.checked)}
        />
        <span className="ld-sms-detail">{TEXTE_NON_MARKETING}</span>
      </label>
      <label className="ld-opt ld-sms">
        <input
          type="checkbox"
          name="consentSmsMarketing"
          checked={marketing}
          onChange={(e) => onMarketing(e.target.checked)}
        />
        <span className="ld-sms-detail">{TEXTE_MARKETING}</span>
      </label>
      <p className="ld-sms-note">
        Both boxes are optional. You can book your call without checking either one.
      </p>
    </fieldset>
  );
}
