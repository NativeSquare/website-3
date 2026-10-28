"use client";

import { useState } from "react";

/**
 * Le calculateur de la fin du guide : le patron met ses propres chiffres, la
 * page calcule ce qu'il perd par an. Tout se passe dans le navigateur, rien
 * n'est envoye. Les valeurs de depart sont des exemples, ecrits comme tels.
 */

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const nb = (valeur: string) => {
  const n = parseFloat(valeur.replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 0;
};

type Valeurs = Record<
  "appels" | "sur" | "chantier" | "devis" | "closing" | "gain" | "chantierDevis" | "clients" | "reserve" | "ticket" | "heures" | "valeur",
  string
>;

const DEPART: Valeurs = {
  appels: "8", sur: "5", chantier: "450",
  devis: "20", closing: "25", gain: "5", chantierDevis: "6000",
  clients: "800", reserve: "5", ticket: "350",
  heures: "6", valeur: "75",
};

function Champ({ label, valeur, onChange, prefixe, suffixe }: { label: string; valeur: string; onChange: (v: string) => void; prefixe?: string; suffixe?: string }) {
  return (
    <label className="ld-calc-champ">
      <span>{label}</span>
      <span className="ld-calc-saisie">
        {prefixe ? <i>{prefixe}</i> : null}
        <input inputMode="decimal" value={valeur} onChange={(e) => onChange(e.target.value)} />
        {suffixe ? <i>{suffixe}</i> : null}
      </span>
    </label>
  );
}

export default function GuideCalculateur() {
  const [v, setV] = useState<Valeurs>(DEPART);
  const maj = (cle: keyof Valeurs) => (valeur: string) => setV((a) => ({ ...a, [cle]: valeur }));

  const sur = nb(v.sur) || 1;
  const appels = nb(v.appels) * (1 / sur) * nb(v.chantier) * 52;
  const devis = nb(v.devis) * (nb(v.gain) / 100) * nb(v.chantierDevis) * 12;
  const anciens = nb(v.clients) * (nb(v.reserve) / 100) * nb(v.ticket);
  const bureau = nb(v.heures) * nb(v.valeur) * 52;
  const total = appels + devis + anciens + bureau;

  return (
    <div className="ld-calc">
      <p className="ld-calc-note">The numbers below are examples. Change them to yours.</p>

      <div className="ld-calc-bloc">
        <h3>Missed calls</h3>
        <div className="ld-calc-champs">
          <Champ label="Calls you miss a week" valeur={v.appels} onChange={maj("appels")} />
          <label className="ld-calc-champ">
            <span>How many would have booked</span>
            <select value={v.sur} onChange={(e) => maj("sur")(e.target.value)}>
              <option value="10">1 in 10</option>
              <option value="5">1 in 5</option>
              <option value="3">1 in 3</option>
            </select>
          </label>
          <Champ label="Average job" valeur={v.chantier} onChange={maj("chantier")} prefixe="$" />
        </div>
        <p className="ld-calc-res">{usd.format(appels)} <small>a year</small></p>
      </div>

      <div className="ld-calc-bloc">
        <h3>Estimates with no follow-up</h3>
        <div className="ld-calc-champs">
          <Champ label="Estimates a month" valeur={v.devis} onChange={maj("devis")} />
          <Champ label="Close rate now" valeur={v.closing} onChange={maj("closing")} suffixe="%" />
          <Champ label="Close rate gain" valeur={v.gain} onChange={maj("gain")} suffixe="points" />
          <Champ label="Average job" valeur={v.chantierDevis} onChange={maj("chantierDevis")} prefixe="$" />
        </div>
        <p className="ld-calc-res">{usd.format(devis)} <small>a year</small></p>
      </div>

      <div className="ld-calc-bloc">
        <h3>Past customers you never call</h3>
        <div className="ld-calc-champs">
          <Champ label="Customers, last two years" valeur={v.clients} onChange={maj("clients")} />
          <Champ label="Would book a job" valeur={v.reserve} onChange={maj("reserve")} suffixe="%" />
          <Champ label="Average ticket" valeur={v.ticket} onChange={maj("ticket")} prefixe="$" />
        </div>
        <p className="ld-calc-res">{usd.format(anciens)} <small>a year</small></p>
      </div>

      <div className="ld-calc-bloc">
        <h3>Office work</h3>
        <div className="ld-calc-champs">
          <Champ label="Hours a week" valeur={v.heures} onChange={maj("heures")} />
          <Champ label="Value of your hour" valeur={v.valeur} onChange={maj("valeur")} prefixe="$" />
        </div>
        <p className="ld-calc-res">{usd.format(bureau)} <small>a year</small></p>
      </div>

      <div className="ld-calc-total">
        <span>What&rsquo;s left on the table, every year</span>
        <strong>{usd.format(total)}</strong>
      </div>
    </div>
  );
}
