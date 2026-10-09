"use client";

import { useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { lireVisiteId } from "../../lib/visite";
import { suivreMeta } from "../../lib/meta";
import {
  CHIFFRES_AFFAIRES,
  DELAIS,
  ROLES,
  SOURCES_CHANTIERS,
} from "../formulaire";

/**
 * Le formulaire de la landing, en deux temps (meeting Angelo du 08/10/2026) :
 *   1. prenom, nom, telephone, e-mail : le lead est enregistre tout de suite, meme
 *      s'il s'arrete la ;
 *   2. les questions : c'est ce temps-la qui envoie « Lead » a Meta, du
 *      navigateur ici, du serveur depuis Convex, avec le meme eventID.
 * Quand le second temps est fini, la page affiche le calendrier.
 *
 * Si le serveur ne repond pas, la personne avance quand meme : un formulaire
 * en panne ne doit jamais empecher une reservation.
 */

type Lead = { prenom: string; nom: string; email: string };

type Props = {
  source: string;
  titre: string;
  boutonContact: string;
  boutonQuestions: string;
  consentement: string;
  onComplete: (lead: Lead) => void;
};

function Puces({
  nom,
  type,
  options,
  valeurs,
  onChange,
}: {
  nom: string;
  type: "checkbox" | "radio";
  options: readonly string[];
  valeurs: string[];
  onChange: (valeurs: string[]) => void;
}) {
  return (
    <div className="ld-opts">
      {options.map((o) => (
        <label className="ld-opt" key={o}>
          <input
            type={type}
            name={nom}
            checked={valeurs.includes(o)}
            onChange={(e) => {
              if (type === "radio") onChange([o]);
              else onChange(e.target.checked ? [...valeurs, o] : valeurs.filter((v) => v !== o));
            }}
          />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}

export default function FormulaireLead({
  source,
  titre,
  boutonContact,
  boutonQuestions,
  consentement,
  onComplete,
}: Props) {
  const [etape, setEtape] = useState<1 | 2>(1);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [fax, setFax] = useState("");
  const [lead, setLead] = useState<{ leadId?: string; jeton?: string }>({});

  const [sources, setSources] = useState<string[]>([]);
  const [chiffreAffaires, setChiffreAffaires] = useState<string[]>([]);
  const [delai, setDelai] = useState<string[]>([]);
  const [role, setRole] = useState<string[]>([]);
  const [siteWeb, setSiteWeb] = useState("");

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

  async function validerContact(e: React.FormEvent) {
    e.preventDefault();
    if (envoi) return;
    setErreur("");
    setEnvoi(true);
    try {
      const r = await envoyer({ etape: 1, prenom, nom, telephone, email, fax });
      /* Une erreur de saisie (400) se corrige ; une panne du serveur ne
         retient personne. */
      if (r.erreur) {
        setErreur(r.erreur);
        return;
      }
      setLead({ leadId: r.leadId, jeton: r.jeton });
      posthog.capture("formulaire_contact", { source, visiteId: lireVisiteId() });
      setEtape(2);
    } catch {
      setEtape(2);
    } finally {
      setEnvoi(false);
    }
  }

  async function validerQuestions(e: React.FormEvent) {
    e.preventDefault();
    if (envoi) return;
    if (!sources.length || !chiffreAffaires.length || !delai.length || !role.length) {
      setErreur("Please answer every question.");
      return;
    }
    setErreur("");
    setEnvoi(true);
    let eventId: string | null | undefined;
    try {
      const r = await envoyer({
        etape: 2,
        leadId: lead.leadId,
        jeton: lead.jeton,
        sources,
        chiffreAffaires: chiffreAffaires[0],
        delai: delai[0],
        role: role[0],
        siteWeb,
      });
      if (r.erreur) {
        setErreur(r.erreur);
        setEnvoi(false);
        return;
      }
      eventId = r.eventId;
    } catch {
      /* On continue : voir plus haut. */
    }

    /* Le Lead du navigateur porte l'identifiant que le serveur a envoye a
       l'API Conversions : Meta n'en compte qu'un. Sans identifiant (serveur
       muet), le navigateur compte seul. */
    if (eventId && window.fbq) {
      window.fbq("track", "Lead", { content_name: "hvac-application" }, { eventID: eventId });
    } else {
      suivreMeta("Lead", { content_name: "hvac-application" });
    }
    posthog.capture("formulaire_complet", { source, visiteId: lireVisiteId() });
    setEnvoi(false);
    onComplete({
      prenom: prenom.trim(),
      nom: nom.trim(),
      email: email.trim().toLowerCase(),
    });
  }

  return (
    <div className="ld-form" id="book">
      <p className="ld-step-label">Step {etape} of 2</p>
      <h2>{titre}</h2>

      {etape === 1 ? (
        <form onSubmit={validerContact} noValidate>
          <div className="ld-row">
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
            <label className="ld-field">
              <span className="lab">Last name</span>
              <input
                type="text"
                name="nom"
                autoComplete="family-name"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </label>
          </div>
          <label className="ld-field">
            <span className="lab">Mobile phone</span>
            <input
              type="tel"
              name="telephone"
              autoComplete="tel"
              inputMode="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              required
            />
          </label>
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
      ) : (
        <form onSubmit={validerQuestions} noValidate>
          <fieldset className="ld-field">
            <legend className="lab">How do you get jobs right now? (pick all that apply)</legend>
            <Puces nom="sources" type="checkbox" options={SOURCES_CHANTIERS} valeurs={sources} onChange={(v) => { setErreur(""); setSources(v); }} />
          </fieldset>
          <fieldset className="ld-field">
            <legend className="lab">What does your company bring in per month?</legend>
            <Puces nom="ca" type="radio" options={CHIFFRES_AFFAIRES} valeurs={chiffreAffaires} onChange={(v) => { setErreur(""); setChiffreAffaires(v); }} />
          </fieldset>
          <fieldset className="ld-field">
            <legend className="lab">How soon do you want more jobs?</legend>
            <Puces nom="delai" type="radio" options={DELAIS} valeurs={delai} onChange={(v) => { setErreur(""); setDelai(v); }} />
          </fieldset>
          <fieldset className="ld-field">
            <legend className="lab">What is your role in the company?</legend>
            <Puces nom="role" type="radio" options={ROLES} valeurs={role} onChange={(v) => { setErreur(""); setRole(v); }} />
          </fieldset>
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
            {envoi ? "One moment…" : boutonQuestions}
          </button>
        </form>
      )}
    </div>
  );
}
