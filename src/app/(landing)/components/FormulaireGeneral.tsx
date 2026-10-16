"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import posthog from "posthog-js";
import { isValidPhoneNumber } from "react-phone-number-input";
import { lireVisiteId } from "../../lib/visite";
import { suivreMeta } from "../../lib/meta";
import { suivreGoogle } from "../../lib/google";
import { parametresLead } from "../../../lib/lead-meta";
import TelephoneInput from "./TelephoneInput";
import { Cartes, type LeadQualifie } from "./FormulaireLead";
import { MOTIFS, ORIGINES, ROLES } from "../formulaire";

/**
 * Le formulaire general (`/book`), pour tout visiteur qui ne vient pas d'une
 * campagne. Meme tunnel que la landing HVAC, un ecran par question, sans les
 * questions d'un metier :
 *   0. comment il nous a trouves ;
 *   1. prenom, telephone, e-mail : obligatoires. Le lead est enregistre et
 *      Slack prevenu a cet instant, avant tout calendrier ;
 *   2. ce qui lui donne envie de parler (plusieurs reponses, une note libre) ;
 *   3. son role ;
 *   4. ce que fait son entreprise, et son site si il veut.
 * Quand le dernier ecran est fini, la page affiche le calendrier.
 *
 * Difference avec la landing HVAC : si le serveur ne confirme pas
 * l'enregistrement des coordonnees, la personne ne passe pas. Personne ne
 * reserve sans que nous puissions le recontacter ; l'echec est note dans
 * PostHog (`formulaire_erreur`) pour qu'on le voie.
 *
 * La progression est gardee dans l'onglet (sessionStorage), comme sur la
 * landing HVAC.
 */

type Props = {
  source: string;
  boutonContact: string;
  boutonFinal: string;
  consentement: string;
  /* « {prenom} » est remplace par le prenom saisi. */
  ouverture: string;
  onComplete: (lead: LeadQualifie) => void;
};

const ECRAN = { ORIGINE: 0, CONTACT: 1, MOTIF: 2, ROLE: 3, ENTREPRISE: 4 } as const;
const NB_ECRANS = 5;
const CLE_STOCKAGE = "ns_quiz_general";

type Sauvegarde = {
  ecran: number;
  origine: string;
  prenom: string;
  email: string;
  lead: { leadId?: string; jeton?: string };
  motifs: string[];
  motifNote: string;
  role: string;
  activite: string;
  siteWeb: string;
};

export default function FormulaireGeneral({
  source,
  boutonContact,
  boutonFinal,
  consentement,
  ouverture,
  onComplete,
}: Props) {
  const [ecran, setEcran] = useState<number>(ECRAN.ORIGINE);
  const [restaure, setRestaure] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const carte = useRef<HTMLDivElement>(null);
  const premierRendu = useRef(true);

  const [origine, setOrigine] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState("");
  /* Cochee d'emblee, comme sur la landing HVAC : la personne la decoche si elle
     ne veut pas de textos, et reserver n'en depend pas. */
  const [consentSms, setConsentSms] = useState(true);
  const [email, setEmail] = useState("");
  /* Piege a robots. Son nom ne dit rien d'un champ de contact : un remplissage
     automatique ne doit pas le reconnaitre. */
  const [piege, setPiege] = useState("");
  const [lead, setLead] = useState<{ leadId?: string; jeton?: string }>({});

  const [motifs, setMotifs] = useState<string[]>([]);
  const [motifNote, setMotifNote] = useState("");
  const [role, setRole] = useState("");
  const [activite, setActivite] = useState("");
  const [siteWeb, setSiteWeb] = useState("");

  /* Reprise apres un rechargement : lecture du stockage apres l'affichage pour
     que les deux rendus restent identiques. Synchronisation avec un systeme
     externe, pas un etat derive. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const brut = sessionStorage.getItem(CLE_STOCKAGE);
      if (brut) {
        const s = JSON.parse(brut) as Partial<Sauvegarde>;
        if (typeof s.ecran === "number" && s.ecran >= 0 && s.ecran < NB_ECRANS) setEcran(s.ecran);
        if (typeof s.origine === "string") setOrigine(s.origine);
        if (typeof s.prenom === "string") setPrenom(s.prenom);
        if (typeof s.email === "string") setEmail(s.email);
        if (s.lead && typeof s.lead === "object") setLead(s.lead);
        if (Array.isArray(s.motifs)) setMotifs(s.motifs.filter((x) => typeof x === "string"));
        if (typeof s.motifNote === "string") setMotifNote(s.motifNote);
        if (typeof s.role === "string") setRole(s.role);
        if (typeof s.activite === "string") setActivite(s.activite);
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
      origine,
      prenom,
      email,
      lead,
      motifs,
      motifNote,
      role,
      activite,
      siteWeb,
    };
    try {
      sessionStorage.setItem(CLE_STOCKAGE, JSON.stringify(sauvegarde));
    } catch {
      /* Pas de stockage : le tunnel marche quand meme. */
    }
  }, [restaure, ecran, origine, prenom, email, lead, motifs, motifNote, role, activite, siteWeb]);

  /* Un evenement par ecran pour voir ou les gens s'arretent. Memes noms que sur
     la landing HVAC : `source` les distingue. */
  useEffect(() => {
    if (!restaure) return;
    posthog.capture("quiz_ecran", { source, ecran, visiteId: lireVisiteId() });
    suivreGoogle("quiz_ecran", { source, ecran });
    if (ecran === ECRAN.CONTACT) suivreGoogle("quiz_start", { source });
  }, [restaure, ecran, source]);

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
      body: JSON.stringify({ ...corps, variante: "general" }),
    });
    return (await reponse.json().catch(() => ({ ok: false }))) as {
      ok?: boolean;
      erreur?: string;
      leadId?: string;
      jeton?: string;
      eventId?: string | null;
    };
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
    let r: Awaited<ReturnType<typeof envoyer>> = { ok: false };
    try {
      r = await envoyer({
        etape: 1,
        prenom,
        telephone,
        consentSms,
        email,
        origine,
        piege,
      });
    } catch {
      /* Traite plus bas, comme toute reponse sans lead enregistre. */
    }
    setEnvoi(false);

    /* Pas de lead enregistre, pas de calendrier : c'est la regle de ce
       formulaire. L'echec est visible dans PostHog. */
    if (r.erreur || !r.leadId || !r.jeton) {
      posthog.capture("formulaire_erreur", {
        source,
        etape: "contact",
        visiteId: lireVisiteId(),
        message: r.erreur ?? "serveur muet",
      });
      setErreur(r.erreur ?? "We couldn't save your details. Please try again in a moment.");
      return;
    }
    setLead({ leadId: r.leadId, jeton: r.jeton });

    /* Le Lead du navigateur porte l'identifiant que le serveur envoie a l'API
       Conversions : Meta n'en compte qu'un. */
    const parametres = parametresLead(undefined, "general");
    if (r.eventId && window.fbq) {
      window.fbq("track", "Lead", parametres, { eventID: r.eventId });
    } else {
      suivreMeta("Lead", parametres);
    }
    posthog.capture("formulaire_contact", { source, visiteId: lireVisiteId(), origine });
    suivreGoogle("generate_lead", { source });
    aller(ECRAN.MOTIF);
  }

  function validerMotif(e: React.FormEvent) {
    e.preventDefault();
    if (!motifs.length) {
      setErreur("Please pick at least one answer.");
      return;
    }
    aller(ECRAN.ROLE);
  }

  async function validerFin(e: React.FormEvent) {
    e.preventDefault();
    if (envoi) return;
    if (activite.trim().length < 2) {
      setErreur("Please tell us what your company does.");
      return;
    }
    setErreur("");
    setEnvoi(true);
    /* Le lead existe deja (le contact ne passe pas sans) : une panne ici ne
       retient personne, ses coordonnees sont enregistrees. */
    try {
      const r = await envoyer({
        etape: 2,
        leadId: lead.leadId,
        jeton: lead.jeton,
        motifs,
        motifNote,
        role,
        activite,
        siteWeb,
      });
      if (r.erreur) {
        setErreur(r.erreur);
        setEnvoi(false);
        return;
      }
    } catch {
      posthog.capture("formulaire_erreur", {
        source,
        etape: "reponses",
        visiteId: lireVisiteId(),
        message: "serveur muet",
      });
    }
    posthog.capture("formulaire_complet", { source, visiteId: lireVisiteId() });
    suivreGoogle("qualify_lead", { source });
    setEnvoi(false);
    onComplete({
      prenom: prenom.trim(),
      email: email.trim().toLowerCase(),
      role,
      chiffreAffaires: "",
    });
  }

  const retourPossible = ecran === ECRAN.CONTACT || ecran > ECRAN.MOTIF;

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

      {ecran === ECRAN.ORIGINE && (
        <>
          <h2>How did you hear about us?</h2>
          <Cartes
            options={ORIGINES}
            valeurs={[origine]}
            onChoix={(o) => choisir(setOrigine, o, ECRAN.ORIGINE)}
          />
        </>
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
            name="ns_trap"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="ld-hp"
            value={piege}
            onChange={(e) => setPiege(e.target.value)}
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

      {ecran === ECRAN.MOTIF && (
        <form onSubmit={validerMotif} noValidate>
          <p className="ld-ok">
            <Check size={18} strokeWidth={2.25} aria-hidden="true" />
            <span>{ouverture.replace("{prenom}", prenom.trim())}</span>
          </p>
          <h2>What made you want to talk?</h2>
          <p className="ld-aide">Pick all that apply.</p>
          <Cartes
            multiple
            options={MOTIFS}
            valeurs={motifs}
            onChoix={(o) => {
              setErreur("");
              setMotifs((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));
            }}
          />
          <label className="ld-field">
            <span className="lab">Anything else we should know? (optional)</span>
            <input
              type="text"
              name="motifNote"
              autoComplete="off"
              maxLength={300}
              value={motifNote}
              onChange={(e) => setMotifNote(e.target.value)}
            />
          </label>
          {erreur && <p className="ld-erreur" role="alert">{erreur}</p>}
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>
      )}

      {ecran === ECRAN.ROLE && (
        <>
          <h2>What is your role in the company?</h2>
          <Cartes
            options={ROLES}
            valeurs={[role]}
            onChoix={(o) => choisir(setRole, o, ECRAN.ROLE)}
          />
        </>
      )}

      {ecran === ECRAN.ENTREPRISE && (
        <form onSubmit={validerFin} noValidate>
          <h2>Tell us about your company</h2>
          <label className="ld-field">
            <span className="lab">What does your company do?</span>
            <input
              type="text"
              name="activite"
              autoComplete="off"
              maxLength={80}
              placeholder="HVAC, roofing, landscaping…"
              value={activite}
              onChange={(e) => setActivite(e.target.value)}
              required
            />
          </label>
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
