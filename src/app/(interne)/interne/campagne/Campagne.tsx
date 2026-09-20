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

const QUESTION: Record<string, string> = {
  Téléphone: "Is there someone dedicated to answering phones and booking estimates, or does that fall on you?",
  Estimates: "After you send a quote, what does your follow-up process look like?",
  "Leads payés": "Do you guys run any ads, Facebook or Google? Are you working with an agency for that?",
};

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

  function pasLePatron(c: Contact) {
    const prenom = window.prompt("Le prénom du patron, s'il l'a donné (vide sinon) :", "") ?? "";
    void poser(c, "Pas le patron", prenom ? { prenom, note: `patron = ${prenom}` } : { note: "pas le patron" });
  }

  function rappeler(c: Contact) {
    const quand = window.prompt("Rappeler quand ? (ex. mar 14h, heure de chez lui)", "") ?? "";
    if (!quand) return;
    void poser(c, "Rappeler", { note: `RAPPEL ${quand}` });
  }

  const portes = useMemo(() => [...new Set(contacts.map((c) => c.porte).filter(Boolean))], [contacts]);
  const visibles = useMemo(
    () =>
      contacts.filter(
        (c) => (voirTout || !SORTIS.has(c.statut)) && (!porteFiltre || c.porte === porteFiltre),
      ),
    [contacts, voirTout, porteFiltre],
  );
  const compte = (s: string) => contacts.filter((c) => c.statut === s).length;
  const appelesAujourdhui = contacts.filter((c) => {
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
            {contacts.length} fiches dans Quo · {visibles.length} à appeler
            {" · "}
            <b>{appelesAujourdhui}</b> appelés aujourd&apos;hui
            {compte("Booké") ? ` · ${compte("Booké")} bookés` : ""}
            {compte("Refus") ? ` · ${compte("Refus")} refus` : ""}
            {compte("Rappeler") ? ` · ${compte("Rappeler")} à rappeler` : ""}
          </p>
        </div>
        <div className="cp-filtres">
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
          const question = QUESTION[c.porte] ?? "";
          const ouverture = c.ouverture || [c.preuve, question].filter(Boolean).join(" ");
          const chips = c.contexte.split(/\s[|·]\s/).filter(Boolean);
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
                <div className={`cp-porte ${classePorte(c.porte)}`}>
                  <b>Porte {c.porte || "?"}</b>
                  {alerte && <p className="cp-alerte">{alerte}</p>}
                  <p className="cp-dit">{ouverture}</p>
                </div>
                <div className="cp-cote">
                  <div className="cp-chips">
                    {chips
                      .filter((x) => x !== alerte)
                      .map((x) => (
                        <span key={x}>{x}</span>
                      ))}
                  </div>
                  {c.notes && <p className="cp-notes">{c.notes}</p>}
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
