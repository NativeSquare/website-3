"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import posthog from "posthog-js";
import { isValidPhoneNumber } from "react-phone-number-input";
import { lireVisiteId } from "../../lib/visite";
import { suivreMeta } from "../../lib/meta";
import { parametresLead } from "../../../lib/lead-meta";
import TelephoneInput from "./TelephoneInput";
import {
  CAPACITES,
  CHIFFRES_AFFAIRES,
  DELAIS,
  ROLES,
  SOURCES_CHANTIERS,
} from "../formulaire";

/**
 * Le tunnel de la landing HVAC, un ecran par question (retour d'Angelo du
 * 09/10/2026) :
 *   0. combien de chantiers peut-il prendre ;
 *   1. sa zone ;
 *   2. prenom, telephone, e-mail : le lead est enregistre, c'est un lead
 *      partiel qu'on peut appeler, et c'est ce temps-la qui envoie « Lead » a
 *      Meta, du navigateur ici, du serveur depuis Convex, avec le meme eventID ;
 *   3 a 6. les questions de qualification, juste avant le calendrier.
 * Quand le dernier ecran est fini, la page affiche le calendrier.
 *
 * Si le serveur ne repond pas, la personne avance quand meme : un formulaire
 * en panne ne doit jamais empecher une reservation.
 *
 * La progression est gardee dans l'onglet (sessionStorage) : un rechargement
 * ne renvoie pas la personne au debut ni ne lui fait redonner son contact.
 */

export type LeadQualifie = {
  prenom: string;
  email: string;
  role: string;
  chiffreAffaires: string;
};

type Props = {
  source: string;
  boutonContact: string;
  boutonFinal: string;
  consentement: string;
  /* « {prenom} » et « {zone} » sont remplaces par les reponses. */
  zoneOuverte: string;
  onComplete: (lead: LeadQualifie) => void;
};

const ECRAN = { CAPACITE: 0, ZONE: 1, CONTACT: 2, ROLE: 3, CA: 4, DELAI: 5, FIN: 6 } as const;
const NB_ECRANS = 7;
const CLE_STOCKAGE = "ns_quiz";

type Sauvegarde = {
  ecran: number;
  capacite: string;
  zone: string;
  prenom: string;
  email: string;
  lead: { leadId?: string; jeton?: string };
  role: string;
  chiffreAffaires: string;
  delai: string;
  sources: string[];
  siteWeb: string;
};

function Cartes({
  options,
  valeurs,
  multiple,
  onChoix,
}: {
  options: readonly string[];
  valeurs: string[];
  multiple?: boolean;
  onChoix: (option: string) => void;
}) {
  return (
    <div className="ld-cartes" role="group">
      {options.map((o) => (
        <button
          type="button"
          key={o}
          className={multiple ? "ld-carte multi" : "ld-carte"}
          aria-pressed={valeurs.includes(o)}
          onClick={() => onChoix(o)}
        >
          <span>{o}</span>
          {multiple && <i className="case" aria-hidden="true" />}
        </button>
      ))}
    </div>
  );
}

export default function FormulaireLead({
  source,
  boutonContact,
  boutonFinal,
  consentement,
  zoneOuverte,
  onComplete,
}: Props) {
  const [ecran, setEcran] = useState<number>(ECRAN.CAPACITE);
  const [restaure, setRestaure] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const carte = useRef<HTMLDivElement>(null);
  const premierRendu = useRef(true);

  const [capacite, setCapacite] = useState("");
  const [zone, setZone] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  /* Cochee d'emblée (demande d'Alexandre, 09/10/2026) : la personne la decoche
     si elle ne veut pas de textos, et reserver n'en depend pas. */
  const [consentSms, setConsentSms] = useState(true);
  const [email, setEmail] = useState("");
  const [fax, setFax] = useState("");
  const [lead, setLead] = useState<{ leadId?: string; jeton?: string }>({});

  const [role, setRole] = useState("");
  const [chiffreAffaires, setChiffreAffaires] = useState("");
  const [delai, setDelai] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [siteWeb, setSiteWeb] = useState("");

  /* Reprise apres un rechargement : le stockage n'existe pas cote serveur, on
     le lit apres l'affichage pour que les deux rendus restent identiques. C'est
     de la synchronisation avec un systeme externe, pas un etat derive. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const brut = sessionStorage.getItem(CLE_STOCKAGE);
      if (brut) {
        const s = JSON.parse(brut) as Partial<Sauvegarde>;
        if (typeof s.ecran === "number" && s.ecran >= 0 && s.ecran < NB_ECRANS) setEcran(s.ecran);
        if (typeof s.capacite === "string") setCapacite(s.capacite);
        if (typeof s.zone === "string") setZone(s.zone);
        if (typeof s.prenom === "string") setPrenom(s.prenom);
        if (typeof s.email === "string") setEmail(s.email);
        if (s.lead && typeof s.lead === "object") setLead(s.lead);
        if (typeof s.role === "string") setRole(s.role);
        if (typeof s.chiffreAffaires === "string") setChiffreAffaires(s.chiffreAffaires);
        if (typeof s.delai === "string") setDelai(s.delai);
        if (Array.isArray(s.sources)) setSources(s.sources.filter((x) => typeof x === "string"));
        if (typeof s.siteWeb === "string") setSiteWeb(s.siteWeb);
      }
    } catch {
      /* Stockage refuse (navigation privee) : on repart du debut. */
    }
    setRestaure(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!restaure) return;
    const sauvegarde: Sauvegarde = {
      ecran,
      capacite,
      zone,
      prenom,
      email,
      lead,
      role,
      chiffreAffaires,
      delai,
      sources,
      siteWeb,
    };
    try {
      sessionStorage.setItem(CLE_STOCKAGE, JSON.stringify(sauvegarde));
    } catch {
      /* Pas de stockage : le tunnel marche quand meme. */
    }
  }, [restaure, ecran, capacite, zone, prenom, email, lead, role, chiffreAffaires, delai, sources, siteWeb]);

  /* Un evenement par ecran pour voir ou les gens s'arretent. */
  useEffect(() => {
    if (!restaure) return;
    posthog.capture("quiz_ecran", { source, ecran, visiteId: lireVisiteId() });
  }, [restaure, ecran, source]);

  /* Sur un ecran plus haut que ce qui reste visible, on remonte au debut de la
     carte ; sinon la page ne bouge pas. */
  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    const haut = carte.current?.getBoundingClientRect().top ?? 0;
    if (haut < 0) carte.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [ecran]);

  function aller(vers: number) {
    setErreur("");
    setEcran(vers);
  }

  /* Un clic sur une carte la choisit, puis passe a l'ecran suivant apres un
     court instant, le temps de voir la selection. */
  function choisir(poser: (valeur: string) => void, valeur: string, depuis: number) {
    poser(valeur);
    setErreur("");
    window.setTimeout(() => setEcran((e) => (e === depuis ? depuis + 1 : e)), 170);
  }

  async function envoyer(corps: Record<string, unknown>) {
    const reponse = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corps),
    });
    return (await reponse.json().catch(() => ({ ok: false }))) as {
      ok?: boolean;
      erreur?: string;
      leadId?: string;
      jeton?: string;
      eventId?: string | null;
    };
  }

  function validerZone(e: React.FormEvent) {
    e.preventDefault();
    if (zone.trim().length < 2) {
      setErreur("Please tell us your area.");
      return;
    }
    aller(ECRAN.CONTACT);
  }

  async function validerContact(e: React.FormEvent) {
    e.preventDefault();
    if (envoi) return;
    setErreur("");
    if (!prenom.trim()) {
      setErreur("Please enter your first name.");
      return;
    }
    /* Le numero doit etre valide pour son pays : un mauvais indicatif ferait
       echouer les appels et les textos. */
    if (!telephone || !isValidPhoneNumber(telephone)) {
      setErreur("Please enter a valid mobile number for the country selected.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErreur("Please enter a valid email.");
      return;
    }
    setEnvoi(true);
    let eventId: string | null | undefined;
    let erreurDeSaisie = false;
    try {
      const r = await envoyer({
        etape: 1,
        prenom,
        telephone,
        consentSms,
        email,
        capacite,
        zone,
        fax,
      });
      /* Une erreur de saisie (400) se corrige ; une panne du serveur ne
         retient personne. */
      if (r.erreur) {
        setErreur(r.erreur);
        erreurDeSaisie = true;
      } else {
        setLead({ leadId: r.leadId, jeton: r.jeton });
        eventId = r.eventId;
      }
    } catch {
      /* On continue : voir plus haut. */
    }
    setEnvoi(false);
    if (erreurDeSaisie) return;

    /* Le Lead du navigateur porte l'identifiant que le serveur envoie a l'API
       Conversions : Meta n'en compte qu'un. Sans identifiant (serveur muet), le
       navigateur compte seul. */
    const parametres = parametresLead(capacite);
    if (eventId && window.fbq) {
      window.fbq("track", "Lead", parametres, { eventID: eventId });
    } else {
      suivreMeta("Lead", parametres);
    }
    posthog.capture("formulaire_contact", { source, visiteId: lireVisiteId(), capacite });
    aller(ECRAN.ROLE);
  }

  async function validerFin(e: React.FormEvent) {
    e.preventDefault();
    if (envoi) return;
    if (!sources.length) {
      setErreur("Please pick at least one answer.");
      return;
    }
    setErreur("");
    setEnvoi(true);
    /* Sans lead enregistre (serveur muet au contact), il n'y a rien a mettre a
       jour : on passe au calendrier. */
    if (lead.leadId && lead.jeton) {
      try {
        const r = await envoyer({
          etape: 2,
          leadId: lead.leadId,
          jeton: lead.jeton,
          sources,
          chiffreAffaires,
          delai,
          role,
          siteWeb,
        });
        if (r.erreur) {
          setErreur(r.erreur);
          setEnvoi(false);
          return;
        }
      } catch {
        /* On continue : voir plus haut. */
      }
    }
    posthog.capture("formulaire_complet", { source, visiteId: lireVisiteId() });
    setEnvoi(false);
    onComplete({
      prenom: prenom.trim(),
      email: email.trim().toLowerCase(),
      role,
      chiffreAffaires,
    });
  }

  const zoneAffichee = zone.trim().length <= 40 ? zone.trim() : "your area";
  const retourPossible = ecran === ECRAN.ZONE || ecran === ECRAN.CONTACT || ecran >= ECRAN.CA;

  return (
    <div className="ld-form" id="book" ref={carte}>
      <div
        className="ld-prog"
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={1}
        aria-valuemax={NB_ECRANS}
        aria-valuenow={ecran + 1}
      >
        <i style={{ width: `${((ecran + 1) / NB_ECRANS) * 100}%` }} />
      </div>
      {retourPossible && (
        <button type="button" className="ld-retour" onClick={() => aller(ecran - 1)}>
          ← Back
        </button>
      )}

      {ecran === ECRAN.CAPACITE && (
        <>
          <h2>How many jobs can you take on right now?</h2>
          <Cartes
            options={CAPACITES}
            valeurs={[capacite]}
            onChoix={(o) => choisir(setCapacite, o, ECRAN.CAPACITE)}
          />
        </>
      )}

      {ecran === ECRAN.ZONE && (
        <form onSubmit={validerZone} noValidate>
          <h2>What area are you in?</h2>
          <label className="ld-field">
            <span className="lab">City or ZIP code</span>
            <input
              type="text"
              name="zone"
              autoComplete="off"
              autoFocus
              maxLength={80}
              placeholder="Miami, FL or 33101"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            />
          </label>
          {erreur && <p className="ld-erreur" role="alert">{erreur}</p>}
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>
      )}

      {ecran === ECRAN.CONTACT && (
        <form onSubmit={validerContact} noValidate>
          <h2>Where can we reach you?</h2>
          <label className="ld-field">
            <span className="lab">First name</span>
            <input
              type="text"
              name="prenom"
              autoComplete="given-name"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </label>
          <div className="ld-field">
            <span className="lab">Mobile phone</span>
            <TelephoneInput value={telephone} onChange={setTelephone} />
          </div>
          <label className="ld-field">
            <span className="lab">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="ld-opt ld-sms">
            <input
              type="checkbox"
              name="consentSms"
              checked={consentSms}
              onChange={(e) => setConsentSms(e.target.checked)}
            />
            <span>
              <b className="ld-sms-titre">
                Recommended: text me the call link and reminders
              </b>
              <span className="ld-sms-detail">
                No spam. We only text you about our appointment, so you don&apos;t
                miss it. By leaving this box checked I agree to receive text
                messages from NativeSquare about my call. Message frequency
                varies, message and data rates may apply, reply STOP to opt out.
                Agreeing is not required to book.{" "}
                <Link href="/legal?section=privacy" target="_blank">
                  Privacy policy
                </Link>
              </span>
            </span>
          </label>
          {/* Piege a robots : invisible, jamais rempli par une personne. */}
          <input
            type="text"
            name="fax"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="ld-hp"
            value={fax}
            onChange={(e) => setFax(e.target.value)}
          />
          {erreur && <p className="ld-erreur" role="alert">{erreur}</p>}
          <button type="submit" className="btn btn-primary" disabled={envoi}>
            {envoi ? "One moment…" : boutonContact}
          </button>
          <p className="ld-consent">
            {consentement}{" "}
            <Link href="/legal" target="_blank">
              Privacy policy
            </Link>
          </p>
        </form>
      )}

      {ecran === ECRAN.ROLE && (
        <>
          <p className="ld-ok">
            <Check size={18} strokeWidth={2.25} aria-hidden="true" />
            <span>
              {zoneOuverte
                .replace("{prenom}", prenom.trim())
                .replace("{zone}", zoneAffichee || "your area")}
            </span>
          </p>
          <h2>What is your role in the company?</h2>
          <Cartes
            options={ROLES}
            valeurs={[role]}
            onChoix={(o) => choisir(setRole, o, ECRAN.ROLE)}
          />
        </>
      )}

      {ecran === ECRAN.CA && (
        <>
          <h2>What does your company bring in per month?</h2>
          <Cartes
            options={CHIFFRES_AFFAIRES}
            valeurs={[chiffreAffaires]}
            onChoix={(o) => choisir(setChiffreAffaires, o, ECRAN.CA)}
          />
        </>
      )}

      {ecran === ECRAN.DELAI && (
        <>
          <h2>How soon do you want more jobs?</h2>
          <Cartes
            options={DELAIS}
            valeurs={[delai]}
            onChoix={(o) => choisir(setDelai, o, ECRAN.DELAI)}
          />
        </>
      )}

      {ecran === ECRAN.FIN && (
        <form onSubmit={validerFin} noValidate>
          <h2>How do you get jobs right now?</h2>
          <p className="ld-aide">Pick all that apply.</p>
          <Cartes
            multiple
            options={SOURCES_CHANTIERS}
            valeurs={sources}
            onChoix={(o) => {
              setErreur("");
              setSources((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));
            }}
          />
          <label className="ld-field">
            <span className="lab">Company website (optional)</span>
            <input
              type="text"
              name="siteWeb"
              autoComplete="url"
              inputMode="url"
              placeholder="yourcompany.com"
              value={siteWeb}
              onChange={(e) => setSiteWeb(e.target.value)}
            />
          </label>
          {erreur && <p className="ld-erreur" role="alert">{erreur}</p>}
          <button type="submit" className="btn btn-primary" disabled={envoi}>
            {envoi ? "One moment…" : boutonFinal}
          </button>
        </form>
      )}
    </div>
  );
}
