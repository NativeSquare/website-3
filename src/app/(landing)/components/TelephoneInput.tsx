"use client";

import PhoneInput from "react-phone-number-input";
import { AU, CA, FR, GB, US } from "country-flag-icons/react/3x2";
import "react-phone-number-input/style.css";

/**
 * Le champ telephone : un selecteur d'indicatif avec drapeau, les Etats-Unis
 * par defaut, puis le numero. La valeur qui remonte est au format international
 * E.164 (« +13055550147 »), le seul que Quo, Meta et la verification d'un
 * numero comprennent sans ambiguite.
 *
 * Bibliotheque : react-phone-number-input (libphonenumber-js). Les drapeaux
 * sont des SVG embarques, pas des images chargees depuis un site externe, et
 * seuls les pays proposes sont inclus dans la page.
 * Doc : https://gitlab.com/catamphetamine/react-phone-number-input
 */

const DRAPEAUX = { US, CA, GB, AU, FR };
const PAYS = ["US", "CA", "GB", "AU", "FR"] as const;

export default function TelephoneInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (e164: string) => void;
}) {
  return (
    <PhoneInput
      name="telephone"
      defaultCountry="US"
      countries={[...PAYS]}
      flags={DRAPEAUX}
      international
      withCountryCallingCode
      countryCallingCodeEditable={false}
      limitMaxLength
      autoComplete="tel"
      inputMode="tel"
      value={value || undefined}
      onChange={(v) => onChange(v ?? "")}
    />
  );
}
