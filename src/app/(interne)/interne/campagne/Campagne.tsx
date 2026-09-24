"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

/* Une fiche = un contact Quo qui porte une phrase d'ouverture. Tout ce qui
   s'affiche vient de Quo, tout ce qu'on clique repart dans Quo. */
type Contact = {
  id: string;
  prenom: string;
  nom: string;
  entreprise: string;
  role: string;
  telephone: string;
  ville: string;
  site: string;
  porte: string;
  ouverture: string;
  contexte: string;
  preuve: string;
  notes: string;
  avis: string;
  note: string;
  statut: string;
};

type Appel = { n: number; dernier: { quand: string; statut: string; duree: number; direction: string } | null };

/* Les statuts qui sortent une fiche de la liste du jour. */
const SORTIS = new Set(["Refus", "Booké"]);

/* La phrase du script que l'accroche rejoint, porte par porte : ce sont les
   mots de l'arbre, pour qu'Alexandre enchaine sans chercher. La preuve du
   telephone ne s'affiche que si l'accroche ne la remplace pas. */
const SCRIPT: Record<string, { preuve?: string; question: string }> = {
  Téléphone: {
    preuve: "I actually tried your main line yesterday and got the voicemail.",
    question: "Is there someone dedicated to answering phones and booking estimates, or does that fall on you?",
  },
  Estimates: {
    preuve: "I was reading your reviews and a couple of them mention waiting on an estimate.",
    question: "After you send a quote, what does your follow-up process look like?",
  },
  "Leads payés": { question: "Do you guys run any ads, Facebook or Google? Are you working with an agency for that?" },
  Temps: {
    question: "If you mapped out your week, how much time are you spending on admin, scheduling, and follow-up versus actually running your business?",
  },
  Reviews: { question: "How are you currently getting customers to leave you guys reviews on Google?" },
};

type Ouverture = { porte: string; accroche: string };

/* Opening dans Quo : « Téléphone » accroche || Estimates » accroche ». Une
   accroche qui finit par « so » rejoint la preuve du script ; une accroche
   qui porte sa propre preuve (une phrase complete) la remplace. */
function lireOuvertures(texte: string): Ouverture[] | null {
  if (!texte.includes("»")) return null;
  return texte
    .split("||")
    .map((m) => m.trim())
    .filter(Boolean)
    .map((m) => {
      const [porte, ...reste] = m.split("»");
      return { porte: porte.trim(), accroche: reste.join("»").trim() };
    });
}

function ligneScript(o: Ouverture): string {
  const s = SCRIPT[o.porte] ?? { question: "" };
  const preuveRemplacee = o.accroche && !/,?s*so$/i.test(o.accroche);
  return [preuveRemplacee ? "" : s.preuve, s.question].filter(Boolean).join(" ");
}

/* La liste d'origine d'une fiche : une chip « LISTE : 2026-09-24 · fenêtres »
   dans Context. Les fiches d'avant cette convention sont la liste roofing. */
const LISTE_ORIGINE = "2026-09-21 · roofing";
function listeDe(c: Contact): string {
  const chip = c.contexte.split(/\s[|·]\s/).find((x) => x.startsWith("LISTE : "));
  return chip ? chip.slice("LISTE : ".length).trim() : LISTE_ORIGINE;
}

function classePorte(porte: string): string {
  if (/lead/i.test(porte)) return "cp-p-ads";
  if (/estim/i.test(porte)) return "cp-p-dev";
  return "cp-p-tel";
}

/* « décroché » ou « sans réponse », d'apres le dernier appel Quo. Une
   conversation de moins de vingt secondes, c'est la messagerie. */
function lireAppel(a?: Appel): string {
  if (!a || a.n <= 0 || !a.dernier) return a && a.n < 0 ? "historique indisponible" : "jamais appelé";
  const d = a.dernier;
  const quand = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(new Date(d.quand));
  const decroche = d.duree >= 20 && /completed|answered|in-progress/.test(d.statut);
  return `${a.n} appel${a.n > 1 ? "s" : ""} · dernier ${quand}, ${decroche ? `décroché, ${Math.round(d.duree / 60)} min` : "sans réponse"}`;
}

function lienBooker(c: Contact): string {
  const p = new URLSearchParams();
  p.set("quo", c.id);
  if (c.prenom && c.prenom !== c.entreprise) p.set("prenom", c.prenom);
  if (c.nom) p.set("nom", c.nom);
  if (c.entreprise) p.set("entreprise", c.entreprise);
  if (c.telephone) p.set("telephone", c.telephone);
  p.set("fuseau", "America/New_York");
  return "/interne/booker?" + p.toString();
}

export default function Campagne() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [appels, setAppels] = useState<Record<string, Appel>>({});
  const [statutDisponible, setStatutDisponible] = useState(true);
  const [chargement, setChargement] = useState(true);
  const [chargementAppels, setChargementAppels] = useState(false);
  const [erreur, setErreur] = useState("");
  const [voirTout, setVoirTout] = useState(false);
  const [porteFiltre, setPorteFiltre] = useState("");
  const [enCours, setEnCours] = useState<string | null>(null);
  const [brouillons, setBrouillons] = useState<Record<string, string>>({});
  const [listeFiltre, setListeFiltre] = useState("");

  const chargerAppels = useCallback(async (liste: Contact[]) => {
    const numeros = liste.map((c) => c.telephone).filter(Boolean);
    if (!numeros.length) return;
    setChargementAppels(true);
    try {
      const r = await fetch("/api/interne/campagne/appels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeros }),
      });
      const d = await r.json();
      if (r.ok) setAppels(d.appels ?? {});
    } catch {
      /* l'historique est un confort : sans lui la page reste utilisable */
    }
    setChargementAppels(false);
  }, []);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur("");
    try {
      const r = await fetch("/api/interne/campagne", { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || d.erreur || "erreur");
      const liste = (d.contacts ?? []) as Contact[];
      setContacts(liste);
      setStatutDisponible(Boolean(d.statutDisponible));
      setChargement(false);
      void chargerAppels(liste);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "erreur");
      setChargement(false);
    }
  }, [chargerAppels]);

  useEffect(() => {
    void charger();
  }, [charger]);

  async function poser(c: Contact, statut: string, extra: { prenom?: string; note?: string } = {}) {
    setEnCours(c.id);
    setErreur("");
    try {
      const r = await fetch("/api/interne/campagne/statut", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, statut, ...extra }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || d.erreur || "erreur");
      setContacts((liste) => liste.map((x) => (x.id === c.id ? { ...x, ...d.contact } : x)));
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "erreur");
    }
    setEnCours(null);
  }

  /* Une note tapee sur la fiche : elle part dans Quo tout de suite. */
  async function noter(c: Contact) {
    const note = (brouillons[c.id] ?? "").trim();
    if (!note) return;
    setEnCours(c.id);
    setErreur("");
    try {
      const r = await fetch("/api/interne/campagne/note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, note }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || d.erreur || "erreur");
      setContacts((liste) => liste.map((x) => (x.id === c.id ? { ...x, ...d.contact } : x)));
      setBrouillons((b) => ({ ...b, [c.id]: "" }));
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "erreur");
    }
    setEnCours(null);
  }

  function pasLePatron(c: Contact) {
    const prenom = window.prompt("Le prénom du patron, s'il l'a donné (vide sinon) :", "") ?? "";
    void poser(c, "Pas le patron", prenom ? { prenom, note: `patron = ${prenom}` } : { note: "pas le patron" });
  }

  function rappeler(c: Contact) {
    const quand = window.prompt("Rappeler quand ? (ex. mar 14h, heure de chez lui)", "") ?? "";
    if (!quand) return;
    void poser(c, "Rappeler", { note: `RAPPEL ${quand}` });
  }

  /* Les listes, la plus recente d'abord ; c'est elle qu'on ouvre. */
  const listes = useMemo(() => [...new Set(contacts.map(listeDe))].sort().reverse(), [contacts]);
  const listeActive = listeFiltre || listes[0] || "";
  const dansListe = useMemo(() => contacts.filter((c) => listeDe(c) === listeActive), [contacts, listeActive]);
  const portes = useMemo(() => [...new Set(dansListe.map((c) => c.porte).filter(Boolean))], [dansListe]);
  const visibles = useMemo(
    () =>
      dansListe.filter(
        (c) => (voirTout || !SORTIS.has(c.statut)) && (!porteFiltre || c.porte === porteFiltre),
      ),
    [dansListe, voirTout, porteFiltre],
  );
  const compte = (s: string) => dansListe.filter((c) => c.statut === s).length;
  const appelesAujourdhui = dansListe.filter((c) => {
    const a = appels[c.telephone];
    if (!a?.dernier) return false;
    const j = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris" }).format(new Date(a.dernier.quand));
    return j === new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris" }).format(new Date());
  }).length;

  return (
    <div className="cp-wrap">
      <div className="cp-tete">
        <div>
          <div className="pill">Pendant l&apos;appel</div>
          <h1>Campagne</h1>
          <p className="cp-sous">
            {dansListe.length} fiches · {visibles.length} à appeler
            {" · "}
            <b>{appelesAujourdhui}</b> appelés aujourd&apos;hui
            {compte("Booké") ? ` · ${compte("Booké")} bookés` : ""}
            {compte("Refus") ? ` · ${compte("Refus")} refus` : ""}
            {compte("Rappeler") ? ` · ${compte("Rappeler")} à rappeler` : ""}
          </p>
        </div>
        <div className="cp-filtres">
          {listes.length > 1 &&
            listes.map((l) => (
              <button
                key={l}
                className={`cp-liste-btn ${listeActive === l ? "on" : ""}`}
                onClick={() => {
                  setListeFiltre(l);
                  setPorteFiltre("");
                }}
              >
                {l}
              </button>
            ))}
          <button className={!porteFiltre ? "on" : ""} onClick={() => setPorteFiltre("")}>
            Toutes portes
          </button>
          {portes.map((p) => (
            <button key={p} className={porteFiltre === p ? "on" : ""} onClick={() => setPorteFiltre(p)}>
              {p}
            </button>
          ))}
          <button className={voirTout ? "on" : ""} onClick={() => setVoirTout((v) => !v)}>
            {voirTout ? "Masquer refus et bookés" : "Voir tout"}
          </button>
          <button onClick={() => void charger()} disabled={chargement}>
            {chargement ? "Chargement…" : chargementAppels ? "Historique…" : "Actualiser"}
          </button>
        </div>
      </div>

      {!statutDisponible && !chargement && (
        <p className="cp-avert">
          La propriété <b>Statut</b> n&apos;existe pas encore dans Quo. Crée-la dans Settings → Contacts,
          type multi-select, options : À appeler, Répondeur, Rappeler, Refus, Booké, Pas le patron. Sans
          elle, les boutons ne peuvent rien écrire.
        </p>
      )}
      {erreur && <p className="bk-erreur">{erreur}</p>}
      {chargement && <p className="bk-vide">Lecture des fiches dans Quo…</p>}
      {!chargement && !contacts.length && !erreur && (
        <p className="bk-vide">Aucune fiche avec une phrase d&apos;ouverture dans Quo.</p>
      )}

      <div className="cp-liste">
        {visibles.map((c, i) => {
          const ouvertures =
            lireOuvertures(c.ouverture) ??
            [{ porte: c.porte, accroche: c.ouverture || c.preuve || "" }];
          const chips = c.contexte.split(/\s[|·]\s/).filter((x) => x && !x.startsWith("LISTE : "));
          const alerte = chips.find((x) => /DEJA EQUIPE|CASSE/.test(x));
          return (
            <article key={c.id} className={`cp-carte ${SORTIS.has(c.statut) ? "cp-sortie" : ""}`}>
              <header className="cp-entete">
                <span className="cp-num">{i + 1}</span>
                <div className="cp-ident">
                  <h3>{c.entreprise || c.prenom}</h3>
                  <p>
                    {[c.ville, c.site].filter(Boolean).join(" · ")}
                    {c.avis ? ` · ${c.avis} avis${c.note ? ` · ${c.note}` : ""}` : ""}
                  </p>
                </div>
                <div className="cp-tel">
                  <a href={`tel:${c.telephone}`}>{c.telephone}</a>
                  <span>
                    {c.prenom && c.prenom !== c.entreprise ? `${c.prenom}${c.role ? ` · ${c.role}` : ""}` : "prénom inconnu"}
                  </span>
                  <button
                    className="cp-copier"
                    onClick={() => void navigator.clipboard.writeText(c.telephone)}
                    title="copier le numéro"
                  >
                    copier
                  </button>
                </div>
                <div className="cp-etat">
                  {c.statut && <span className={`cp-statut cp-s-${c.statut.replace(/\W/g, "").toLowerCase()}`}>{c.statut}</span>}
                  <span className="cp-appels">{chargementAppels && !appels[c.telephone] ? "…" : lireAppel(appels[c.telephone])}</span>
                </div>
              </header>

              <div className="cp-corps">
                <div className="cp-porte">
                  {alerte && <p className="cp-alerte">{alerte}</p>}
                  <ul className="cp-portes">
                    {ouvertures.map((o, j) => (
                      <li key={o.porte} className={`${classePorte(o.porte)} ${j === 0 ? "cp-principale" : ""}`}>
                        <b>{j === 0 ? "Porte " : "Puis "}{o.porte}</b>
                        <p className="cp-dit">
                          {o.accroche ? <mark>{o.accroche}</mark> : <em>sans accroche, tu poses la question du script :</em>}{" "}
                          <span className="cp-script">{ligneScript(o)}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="cp-cote">
                  <div className="cp-chips">
                    {chips
                      .filter((x) => x !== alerte)
                      .map((x) => (
                        <span key={x}>{x}</span>
                      ))}
                  </div>
                  {c.notes && (
                    <ul className="cp-notes">
                      {c.notes.split(" | ").map((n, k) => (
                        <li key={k}>{n}</li>
                      ))}
                    </ul>
                  )}
                  <form
                    className="cp-noter"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void noter(c);
                    }}
                  >
                    <input
                      value={brouillons[c.id] ?? ""}
                      onChange={(e) => setBrouillons((b) => ({ ...b, [c.id]: e.target.value }))}
                      placeholder="Une note sur l'appel, Entrée pour l'enregistrer dans Quo"
                    />
                    <button type="submit" disabled={enCours === c.id || !(brouillons[c.id] ?? "").trim()}>
                      {enCours === c.id ? "…" : "Noter"}
                    </button>
                  </form>
                </div>
              </div>

              <footer className="cp-actions">
                <button disabled={enCours === c.id} onClick={() => void poser(c, "Refus")}>
                  Refus
                </button>
                <button disabled={enCours === c.id} onClick={() => pasLePatron(c)}>
                  Pas le patron
                </button>
                <button disabled={enCours === c.id} onClick={() => rappeler(c)}>
                  Rappeler
                </button>
                <button disabled={enCours === c.id} onClick={() => void poser(c, "Répondeur")}>
                  Répondeur
                </button>
                <a className="btn btn-primary cp-booker" href={lienBooker(c)} target="_blank" rel="noreferrer">
                  Booker
                </a>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}
