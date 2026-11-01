"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { FROID, GLISSE, RAPPELS, type Carte, type Ligne, type Onglet } from "./script";

/* La page d'appels. On charge une liste (une session de cold calling) ou les
   rappels du jour, et on enchaîne : un clic sur le résultat de l'appel l'écrit
   dans Convex et passe à la fiche suivante. Les mots du script sont ceux de
   console-appel-v2 ; le fait et le comment de la liste les remplissent. */

type Statut = "a_appeler" | "pas_de_reponse" | "repondeur" | "pas_patron" | "rappeler" | "refus" | "booke";

type Prospect = {
  _id: string;
  liste: string;
  rang: number;
  prenom?: string;
  nom?: string;
  entreprise: string;
  telephone: string;
  email?: string;
  ville?: string;
  etat?: string;
  comte?: string;
  site?: string;
  avis?: number;
  note?: number;
  fermeture?: string;
  sourceNom?: string;
  noteNom?: string;
  contexte?: string;
  creeLe?: number;
  statut: Statut;
  statutJour: Statut;
  hier?: Statut;
  notes?: string;
  appels: number;
  dernierAppel?: number;
  rappelLe?: string;
};

type Liste = {
  cle: string;
  nom: string;
  genre: "froid" | "rappels";
  jour: string | null;
  fait: string | null;
  comment: string | null;
  total: number;
  nommes: number;
  par: Record<string, number>;
};

const LIBELLE: Record<Statut, string> = {
  a_appeler: "À appeler",
  pas_de_reponse: "Pas de réponse",
  repondeur: "Répondeur",
  pas_patron: "Pas le patron",
  rappeler: "À rappeler",
  refus: "Refus",
  booke: "Booké",
};

const BOUTONS: { statut: Statut; label: string; touche: string; classe: string }[] = [
  { statut: "pas_de_reponse", label: "Pas de réponse", touche: "1", classe: "ap-b-neutre" },
  { statut: "repondeur", label: "Répondeur", touche: "2", classe: "ap-b-neutre" },
  { statut: "pas_patron", label: "Pas le patron", touche: "3", classe: "ap-b-orange" },
  { statut: "rappeler", label: "Rappeler demain", touche: "4", classe: "ap-b-bleu" },
  { statut: "refus", label: "Refus", touche: "5", classe: "ap-b-rouge" },
  { statut: "booke", label: "Booké", touche: "6", classe: "ap-b-vert" },
];

const DECROCHES: Statut[] = ["pas_patron", "rappeler", "refus", "booke"];

/* ————— fuseau et heure chez lui ————— */

const ETATS: [string, string, string][] = [
  ["AL", "Alabama", "America/Chicago"], ["AK", "Alaska", "America/Anchorage"], ["AZ", "Arizona", "America/Phoenix"],
  ["AR", "Arkansas", "America/Chicago"], ["CA", "California", "America/Los_Angeles"], ["CO", "Colorado", "America/Denver"],
  ["CT", "Connecticut", "America/New_York"], ["DE", "Delaware", "America/New_York"], ["FL", "Florida", "America/New_York"],
  ["GA", "Georgia", "America/New_York"], ["HI", "Hawaii", "Pacific/Honolulu"], ["ID", "Idaho", "America/Denver"],
  ["IL", "Illinois", "America/Chicago"], ["IN", "Indiana", "America/New_York"], ["IA", "Iowa", "America/Chicago"],
  ["KS", "Kansas", "America/Chicago"], ["KY", "Kentucky", "America/New_York"], ["LA", "Louisiana", "America/Chicago"],
  ["ME", "Maine", "America/New_York"], ["MD", "Maryland", "America/New_York"], ["MA", "Massachusetts", "America/New_York"],
  ["MI", "Michigan", "America/New_York"], ["MN", "Minnesota", "America/Chicago"], ["MS", "Mississippi", "America/Chicago"],
  ["MO", "Missouri", "America/Chicago"], ["MT", "Montana", "America/Denver"], ["NE", "Nebraska", "America/Chicago"],
  ["NV", "Nevada", "America/Los_Angeles"], ["NH", "New Hampshire", "America/New_York"], ["NJ", "New Jersey", "America/New_York"],
  ["NM", "New Mexico", "America/Denver"], ["NY", "New York", "America/New_York"], ["NC", "North Carolina", "America/New_York"],
  ["ND", "North Dakota", "America/Chicago"], ["OH", "Ohio", "America/New_York"], ["OK", "Oklahoma", "America/Chicago"],
  ["OR", "Oregon", "America/Los_Angeles"], ["PA", "Pennsylvania", "America/New_York"], ["RI", "Rhode Island", "America/New_York"],
  ["SC", "South Carolina", "America/New_York"], ["SD", "South Dakota", "America/Chicago"], ["TN", "Tennessee", "America/Chicago"],
  ["TX", "Texas", "America/Chicago"], ["UT", "Utah", "America/Denver"], ["VT", "Vermont", "America/New_York"],
  ["WV", "West Virginia", "America/New_York"], ["VA", "Virginia", "America/New_York"], ["WA", "Washington", "America/Los_Angeles"],
  ["WI", "Wisconsin", "America/Chicago"], ["WY", "Wyoming", "America/Denver"],
];

const FUSEAUX_BOOKER = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"];

function fuseauDe(p: Prospect): string | null {
  const brut = (p.etat ?? "").trim();
  const parAbrev = ETATS.find((e) => e[0] === brut.toUpperCase());
  if (parAbrev) return parAbrev[2];
  const bas = `${brut} ${p.ville ?? ""}`.toLowerCase();
  const parNom = ETATS.find((e) => new RegExp(`\\b${e[1].toLowerCase()}\\b`).test(bas));
  if (parNom) return parNom[2];
  const fin = `${brut} ${p.ville ?? ""}`.match(/,\s*([A-Z]{2})\b/);
  if (fin) return ETATS.find((e) => e[0] === fin[1])?.[2] ?? null;
  return null;
}

function heureLa(tz: string, ts: number): { texte: string; ouvert: boolean } {
  const date = new Date(ts);
  const texte = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(date);
  const h = parseInt(new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: tz }).format(date), 10) % 24;
  return { texte, ouvert: h >= 8 && h < 17 };
}

const fmtTel = (t: string) => (t.length === 10 ? `(${t.slice(0, 3)}) ${t.slice(3, 6)}-${t.slice(6)}` : t);

function jourLocal(ts: number): number {
  const d = new Date(ts);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/* « You left me your info … {quand} » */
function quand(creeLe?: number): string {
  if (!creeLe) return "recently";
  const n = Math.round((jourLocal(Date.now()) - jourLocal(creeLe)) / 86400000);
  if (n <= 0) return "earlier today";
  if (n === 1) return "yesterday";
  return `${n} days ago`;
}

function demain(decalage = 1): string {
  const d = new Date();
  d.setDate(d.getDate() + decalage);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function ligneDe(contexte: string | undefined, cle: string): string {
  return contexte?.split("\n").find((l) => l.startsWith(`${cle} : `))?.slice(cle.length + 3) ?? "";
}

function lienBooker(p: Prospect, fuseau: string | null): string {
  const q = new URLSearchParams();
  if (p.prenom) q.set("prenom", p.prenom);
  if (p.nom) q.set("nom", p.nom);
  if (p.entreprise && !p.entreprise.startsWith("(")) q.set("entreprise", p.entreprise);
  q.set("telephone", p.telephone);
  if (p.notes) q.set("note", p.notes);
  if (fuseau && FUSEAUX_BOOKER.includes(fuseau)) q.set("fuseau", fuseau);
  return `/interne/booker?${q.toString()}`;
}

/* ————— le script, avec ses crochets remplis ————— */

const NOM_VARIABLE: Record<string, string> = {
  prenom: "prénom", fait: "fait", comment: "comment", heure: "heure", h1: "créneau 1", h2: "créneau 2",
  etat: "État", x: "chantiers", email: "e-mail", quand: "quand",
};

function remplir(l: Ligne, vars: Record<string, string>, anonyme: boolean): ReactNode[] {
  const t = anonyme && l.anonyme ? l.anonyme : l.texte;
  return t.split(/(\{\w+\})/g).map((m, i) => {
    const k = m.match(/^\{(\w+)\}$/)?.[1];
    if (!k) return m;
    const v = vars[k];
    return (
      <b key={i} className={v ? "ap-v" : "ap-v ap-v-vide"}>
        {v || `[${NOM_VARIABLE[k] ?? k}]`}
      </b>
    );
  });
}

function BlocLigne({ l, vars, anonyme }: { l: Ligne; vars: Record<string, string>; anonyme: boolean }) {
  return (
    <div className="ap-ligne">
      {l.pause ? <span className="ap-pause">{l.pause}</span> : null}
      <p>{remplir(l, vars, anonyme)}</p>
    </div>
  );
}

function BlocCarte({ c, vars, anonyme }: { c: Carte; vars: Record<string, string>; anonyme: boolean }) {
  return (
    <details className="ap-carte-obj">
      <summary>
        <span className="ap-lui">{c.lui}</span>
        {c.aValider ? <em className="ap-tag">à valider</em> : null}
      </summary>
      {c.moi.map((l, i) => (
        <BlocLigne key={i} l={l} vars={vars} anonyme={anonyme} />
      ))}
      {c.note ? <p className="ap-note-carte">{c.note.replace(/\{prenom\}/g, vars.prenom || "the owner")}</p> : null}
    </details>
  );
}

/* ————— la page ————— */

export default function Appels() {
  const [listes, setListes] = useState<Liste[]>([]);
  const [cle, setCle] = useState("");
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [courantId, setCourantId] = useState<string | null>(null);
  const [filtre, setFiltre] = useState<string>("a_faire");
  const [notes, setNotes] = useState("");
  const [notesSales, setNotesSales] = useState(false);
  const [prenomAppris, setPrenomAppris] = useState("");
  const [onglet, setOnglet] = useState(0);
  const [heure, setHeure] = useState("");
  const [h1, setH1] = useState("");
  const [h2, setH2] = useState("");
  const [dateRappel, setDateRappel] = useState("");
  const [copie, setCopie] = useState(false);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);
  const [maintenant, setMaintenant] = useState(() => Date.now());

  const liste = listes.find((l) => l.cle === cle) ?? null;
  const rappels = liste?.genre === "rappels";
  const script: Onglet[] = rappels ? RAPPELS : FROID;
  const p = prospects.find((x) => x._id === courantId) ?? null;

  useEffect(() => {
    const t = setInterval(() => setMaintenant(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  const lireProspect = useCallback((x: Prospect | null) => {
    setCourantId(x ? x._id : null);
    setNotes(x?.notes ?? "");
    setNotesSales(false);
    setPrenomAppris("");
    setDateRappel("");
  }, []);

  const chargerListe = useCallback(
    async (nouvelle: string) => {
      setChargement(true);
      setErreur("");
      try {
        const r = await fetch(`/api/interne/appels?liste=${encodeURIComponent(nouvelle)}`, { cache: "no-store" });
        const d = await r.json();
        if (!r.ok) throw new Error(d.detail || d.erreur || "erreur");
        const lignes = (d.prospects ?? []) as Prospect[];
        setCle(nouvelle);
        setProspects(lignes);
        lireProspect(lignes.find((x) => x.statutJour === "a_appeler") ?? lignes[0] ?? null);
        setOnglet(0);
        try {
          localStorage.setItem("ns_appels_liste", nouvelle);
        } catch {
          /* le dernier choix est un confort */
        }
      } catch (e) {
        setErreur(e instanceof Error ? e.message : "erreur");
      }
      setChargement(false);
    },
    [lireProspect],
  );

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur("");
    try {
      const r = await fetch("/api/interne/appels", { cache: "no-store" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.detail || d.erreur || "erreur");
      const toutes = (d.listes ?? []) as Liste[];
      setListes(toutes);
      let choix = "";
      try {
        choix = localStorage.getItem("ns_appels_liste") ?? "";
      } catch {
        /* sans mémoire du dernier choix */
      }
      if (!toutes.some((l) => l.cle === choix)) {
        const aujourdhui = demain(0);
        choix =
          toutes.find((l) => l.jour === aujourdhui)?.cle ??
          toutes.find((l) => l.cle === "rappels" && (l.par.a_appeler ?? 0) > 0)?.cle ??
          toutes.find((l) => l.genre === "froid" && (l.par.a_appeler ?? 0) > 0)?.cle ??
          toutes[0]?.cle ??
          "";
      }
      if (choix) await chargerListe(choix);
      else setChargement(false);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "erreur");
      setChargement(false);
    }
  }, [chargerListe]);

  useEffect(() => {
    void charger();
  }, [charger]);

  /* Écrit sur le serveur ; en cas d'échec, on le dit et on recharge la liste. */
  const envoyer = useCallback(
    async (id: string, corps: Record<string, unknown>) => {
      try {
        const r = await fetch("/api/interne/appels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...corps }),
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.detail || d.erreur || "erreur");
        return true;
      } catch (e) {
        setErreur(`Pas enregistré : ${e instanceof Error ? e.message : "erreur"}`);
        return false;
      }
    },
    [],
  );

  const sauverNotes = useCallback(async () => {
    if (!p || !notesSales) return;
    setProspects((l) => l.map((x) => (x._id === p._id ? { ...x, notes } : x)));
    setNotesSales(false);
    await envoyer(p._id, { notes });
  }, [p, notes, notesSales, envoyer]);

  /* Les notes se sauvent seules après une pause de frappe. */
  useEffect(() => {
    if (!notesSales) return;
    const t = setTimeout(() => void sauverNotes(), 900);
    return () => clearTimeout(t);
  }, [notes, notesSales, sauverNotes]);

  const aller = useCallback(
    (x: Prospect | null) => {
      void sauverNotes();
      lireProspect(x);
    },
    [sauverNotes, lireProspect],
  );

  const poser = useCallback(
    async (statut: Statut, rappelLe?: string) => {
      if (!p) return;
      const id = p._id;
      const jour = statut === "rappeler" ? rappelLe || dateRappel || demain(1) : undefined;
      const ts = Date.now();
      const apres = prospects.map((x) =>
        x._id === id
          ? { ...x, statut, statutJour: statut, appels: x.appels + 1, dernierAppel: ts, notes, rappelLe: jour }
          : x,
      );
      setProspects(apres);
      setNotesSales(false);
      /* La suivante : la prochaine « à appeler » après celle-ci, sinon la première de la liste. */
      const i = apres.findIndex((x) => x._id === id);
      const suite =
        apres.slice(i + 1).find((x) => x.statutJour === "a_appeler") ?? apres.find((x) => x.statutJour === "a_appeler");
      lireProspect(suite ?? apres[i]);
      const ok = await envoyer(id, { statut, notes, rappelLe: jour });
      if (!ok) void chargerListe(cle);
    },
    [p, prospects, notes, dateRappel, lireProspect, envoyer, chargerListe, cle],
  );

  const apprendrePrenom = useCallback(async () => {
    const prenom = prenomAppris.trim();
    if (!p || !prenom) return;
    setProspects((l) => l.map((x) => (x._id === p._id ? { ...x, prenom } : x)));
    setPrenomAppris("");
    await envoyer(p._id, { prenom });
  }, [p, prenomAppris, envoyer]);

  const voisin = useCallback(
    (sens: 1 | -1) => {
      if (!p) return;
      const i = prospects.findIndex((x) => x._id === p._id);
      const cible = prospects[i + sens];
      if (cible) aller(cible);
    },
    [p, prospects, aller],
  );

  const copier = useCallback(async () => {
    if (!p) return;
    try {
      await navigator.clipboard.writeText(p.telephone);
      setCopie(true);
      setTimeout(() => setCopie(false), 1500);
    } catch {
      setErreur("Copie impossible : sélectionne le numéro à la main.");
    }
  }, [p]);

  /* Les raccourcis : 1 à 6 pour le résultat, flèches pour naviguer, C pour copier le numéro. */
  useEffect(() => {
    function touche(e: KeyboardEvent) {
      const cible = e.target as HTMLElement | null;
      if (cible && /^(INPUT|TEXTAREA|SELECT)$/.test(cible.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const b = BOUTONS.find((x) => x.touche === e.key);
      if (b) {
        e.preventDefault();
        void poser(b.statut);
      } else if (e.key === "ArrowRight") voisin(1);
      else if (e.key === "ArrowLeft") voisin(-1);
      else if (e.key.toLowerCase() === "c") void copier();
    }
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, [poser, voisin, copier]);

  const compte = useMemo(() => {
    const c: Record<string, number> = {};
    for (const x of prospects) c[x.statutJour] = (c[x.statutJour] ?? 0) + 1;
    const faits = prospects.length - (c.a_appeler ?? 0);
    return {
      c,
      faits,
      restants: c.a_appeler ?? 0,
      decroches: DECROCHES.reduce((n, s) => n + (c[s] ?? 0), 0),
    };
  }, [prospects]);

  /* Le numéro d'une fiche est sa place dans la liste (celle des rappels change chaque jour). */
  const numeros = useMemo(() => new Map(prospects.map((x, i) => [x._id, i + 1])), [prospects]);

  const visibles = useMemo(
    () =>
      prospects.filter((x) =>
        filtre === "tous" ? true : filtre === "a_faire" ? x.statutJour === "a_appeler" : x.statutJour === filtre,
      ),
    [prospects, filtre],
  );

  const fuseau = p ? fuseauDe(p) : null;
  const chez = p && fuseau ? heureLa(fuseau, maintenant) : null;
  const anonyme = !p?.prenom;
  const vars: Record<string, string> = {
    prenom: p?.prenom ?? "",
    fait: liste?.fait ?? "",
    comment: liste?.comment ?? "",
    heure,
    h1,
    h2,
    etat: p ? ligneDe(p.contexte, "Zone") || p.etat || "" : "",
    x: p ? ligneDe(p.contexte, "Chantiers par mois") : "",
    email: p?.email ?? "",
    quand: p ? quand(p.creeLe) : "",
  };
  const ongletCourant = script[Math.min(onglet, script.length - 1)];

  return (
    <div className="ap-wrap">
      <div className="ap-tete">
        <div>
          <h1>Appels</h1>
          <p className="ap-sous">
            {liste ? (
              <>
                <b>{compte.faits}</b> faits sur {prospects.length} · <b>{compte.restants}</b> restants ·{" "}
                <b>{compte.decroches}</b> décrochés · <b>{compte.c.booke ?? 0}</b> bookés
              </>
            ) : (
              "Aucune liste chargée."
            )}
          </p>
        </div>
        <div className="ap-choix">
          <label>
            Liste
            <select value={cle} onChange={(e) => void chargerListe(e.target.value)} disabled={chargement}>
              {listes.map((l) => (
                <option key={l.cle} value={l.cle}>
                  {l.nom} · {l.total} fiches{l.nommes ? ` (${l.nommes} nommées)` : ""}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="ap-lien" onClick={() => void charger()} disabled={chargement}>
            Actualiser
          </button>
        </div>
      </div>

      {erreur ? <p className="ap-erreur">{erreur}</p> : null}

      {liste && !rappels ? (
        <p className="ap-session">
          <span>
            Le fait, le même sur toute la session : « I noticed <b>{liste.fait}</b> »
          </span>
          <span>
            Le comment : « mostly by <b>{liste.comment}</b> »
          </span>
        </p>
      ) : null}

      <div className="ap-grille">
        {/* la file */}
        <aside className="ap-file">
          <div className="ap-filtres">
            {[
              ["a_faire", `À faire ${compte.restants}`],
              ["tous", `Tous ${prospects.length}`],
              ["rappeler", `Rappeler ${compte.c.rappeler ?? 0}`],
              ["pas_patron", `Pas le patron ${compte.c.pas_patron ?? 0}`],
              ["booke", `Bookés ${compte.c.booke ?? 0}`],
            ].map(([k, label]) => (
              <button key={k} type="button" className={filtre === k ? "on" : ""} onClick={() => setFiltre(k)}>
                {label}
              </button>
            ))}
          </div>
          <ol className="ap-liste">
            {visibles.map((x) => (
              <li key={x._id}>
                <button
                  type="button"
                  className={`ap-ligne-file ${x._id === courantId ? "on" : ""} ap-s-${x.statutJour}`}
                  onClick={() => aller(x)}
                >
                  <span className="ap-rang">{numeros.get(x._id)}</span>
                  <span className="ap-nom">
                    <b>{x.prenom ? `${x.prenom} ${x.nom ?? ""}`.trim() : x.entreprise}</b>
                    <small>
                      {x.prenom ? x.entreprise : "prénom inconnu"}
                      {x.avis ? ` · ${x.avis} avis` : ""}
                    </small>
                  </span>
                  <span className="ap-badge">
                    {x.statutJour === "a_appeler" ? (x.hier ? `hier : ${LIBELLE[x.hier]}` : "") : LIBELLE[x.statutJour]}
                  </span>
                </button>
              </li>
            ))}
            {!visibles.length ? (
              <li className="ap-vide">
                {chargement
                  ? "Chargement…"
                  : filtre === "a_faire" && prospects.length
                    ? `Liste terminée : ${compte.faits} fiches, ${compte.decroches} décrochés, ${compte.c.booke ?? 0} bookés. « Tous » pour tout revoir.`
                    : "Rien dans ce filtre."}
              </li>
            ) : null}
          </ol>
        </aside>

        {/* la fiche */}
        <section className="ap-fiche">
          {p ? (
            <>
              <div className="ap-carte">
                <div className="ap-bandeau">
                  <span>
                    Fiche {numeros.get(p._id)} sur {prospects.length}
                  </span>
                  {p.hier ? <span className="ap-hier">hier : {LIBELLE[p.hier]}</span> : null}
                  {p.appels > 0 ? (
                    <span>
                      {p.appels} appel{p.appels > 1 ? "s" : ""}
                    </span>
                  ) : null}
                  {p.rappelLe ? <span>à rappeler le {p.rappelLe}</span> : null}
                </div>
                <h2 className="ap-qui">{p.prenom ? `${p.prenom} ${p.nom ?? ""}`.trim() : "Prénom inconnu"}</h2>
                <p className="ap-ent">
                  {p.entreprise}
                  {p.ville ? ` · ${p.ville}` : ""}
                  {p.etat && p.etat.length <= 3 ? `, ${p.etat}` : ""}
                  {p.comte ? ` · comté de ${p.comte.charAt(0) + p.comte.slice(1).toLowerCase()}` : ""}
                </p>

                <div className="ap-tel">
                  <strong>{fmtTel(p.telephone)}</strong>
                  <button type="button" onClick={() => void copier()}>
                    {copie ? "Copié" : "Copier (C)"}
                  </button>
                  <a href={`tel:+1${p.telephone}`}>tel:</a>
                  {chez ? (
                    <span className={chez.ouvert ? "ap-heure ap-ok" : "ap-heure ap-hors"}>{chez.texte} chez lui</span>
                  ) : (
                    <span className="ap-heure">fuseau inconnu</span>
                  )}
                </div>

                <dl className="ap-faits">
                  {p.avis ? (
                    <div>
                      <dt>Avis Google</dt>
                      <dd>
                        {p.avis} · {p.note ?? "?"}★
                      </dd>
                    </div>
                  ) : null}
                  {p.fermeture ? (
                    <div>
                      <dt>Ferme</dt>
                      <dd>{p.fermeture === "24h" ? "24 h/24 affiché" : `${p.fermeture} en semaine`}</dd>
                    </div>
                  ) : null}
                  {p.site ? (
                    <div>
                      <dt>Site</dt>
                      <dd>
                        <a href={p.site.startsWith("http") ? p.site : `https://${p.site}`} target="_blank" rel="noopener noreferrer">
                          {p.site.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
                        </a>
                      </dd>
                    </div>
                  ) : null}
                  {p.email ? (
                    <div>
                      <dt>E-mail</dt>
                      <dd>{p.email}</dd>
                    </div>
                  ) : null}
                </dl>

                {p.contexte ? <pre className="ap-ctx">{p.contexte}</pre> : null}
                {p.noteNom ? <p className="ap-source">D&apos;où vient le prénom : {p.noteNom}</p> : null}

                {anonyme ? (
                  <div className="ap-appris">
                    <input
                      value={prenomAppris}
                      onChange={(e) => setPrenomAppris(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && void apprendrePrenom()}
                      placeholder="Prénom appris pendant l'appel"
                    />
                    <button type="button" onClick={() => void apprendrePrenom()} disabled={!prenomAppris.trim()}>
                      Enregistrer
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="ap-resultat">
                <p className="ap-titre-petit">Résultat de l&apos;appel · touches 1 à 6, flèches pour naviguer</p>
                <div className="ap-boutons">
                  {BOUTONS.map((b) => (
                    <button key={b.statut} type="button" className={b.classe} onClick={() => void poser(b.statut)}>
                      <kbd>{b.touche}</kbd> {b.label}
                    </button>
                  ))}
                </div>
                <div className="ap-rappel">
                  <span>Rappeler plus tard :</span>
                  <button type="button" onClick={() => void poser("rappeler", demain(2))}>
                    dans 2 jours
                  </button>
                  <button type="button" onClick={() => void poser("rappeler", demain(7))}>
                    dans 7 jours
                  </button>
                  <input type="date" value={dateRappel} min={demain(1)} onChange={(e) => setDateRappel(e.target.value)} />
                  <button type="button" disabled={!dateRappel} onClick={() => void poser("rappeler", dateRappel)}>
                    ce jour-là
                  </button>
                </div>
                <div className="ap-actions">
                  <a href={lienBooker(p, fuseau)} target="_blank" rel="noopener noreferrer" className="ap-lien-booker">
                    Ouvrir le booker, fiche préremplie
                  </a>
                  <button type="button" onClick={() => voisin(-1)}>
                    ← Précédente
                  </button>
                  <button type="button" onClick={() => voisin(1)}>
                    Suivante →
                  </button>
                </div>
              </div>

              <div className="ap-notes">
                <label htmlFor="ap-notes">Notes{notesSales ? " · non enregistrées" : p.notes ? " · enregistrées" : ""}</label>
                <textarea
                  id="ap-notes"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                    setNotesSales(true);
                  }}
                  onBlur={() => void sauverNotes()}
                  placeholder="Ses mots, l'heure à laquelle le patron est là, la raison du refus…"
                  rows={5}
                />
              </div>
            </>
          ) : (
            <div className="ap-carte ap-vide-carte">
              <h2>{chargement ? "Chargement…" : "Rien à appeler dans cette liste"}</h2>
              <p>
                {rappels
                  ? "Aucun lead n'attend de rappel pour le moment."
                  : "Choisis une autre liste dans le menu en haut."}
              </p>
            </div>
          )}
        </section>

        {/* le script */}
        <aside className="ap-script">
          <div className="ap-onglets">
            {script.map((o, i) => (
              <button key={o.id} type="button" className={i === onglet ? "on" : ""} onClick={() => setOnglet(i)}>
                {o.titre}
              </button>
            ))}
          </div>
          <div className="ap-vars">
            {rappels ? (
              <>
                <label>
                  Créneau 1
                  <input value={h1} onChange={(e) => setH1(e.target.value)} placeholder="tomorrow at 9" />
                </label>
                <label>
                  Créneau 2
                  <input value={h2} onChange={(e) => setH2(e.target.value)} placeholder="Thursday at 10" />
                </label>
              </>
            ) : (
              <label>
                Heure proposée
                <input value={heure} onChange={(e) => setHeure(e.target.value)} placeholder="5" />
              </label>
            )}
          </div>
          {ongletCourant ? (
            <div className="ap-script-corps">
              <p className="ap-but">{ongletCourant.but}</p>
              {ongletCourant.lignes.map((l, i) => (
                <BlocLigne key={i} l={l} vars={vars} anonyme={anonyme} />
              ))}
              {ongletCourant.cartes.length ? <p className="ap-titre-petit">S&apos;il répond…</p> : null}
              {ongletCourant.cartes.map((c, i) => (
                <BlocCarte key={i} c={c} vars={vars} anonyme={anonyme} />
              ))}
              <details className="ap-carte-obj">
                <summary>
                  <span className="ap-lui">Il glisse, il s&apos;impatiente</span>
                </summary>
                {GLISSE.map((g) => (
                  <div className="ap-ligne" key={g}>
                    <p>{g}</p>
                  </div>
                ))}
                <p className="ap-note-carte">Un seul pattern-interrupt, puis tu reprends où tu en étais.</p>
              </details>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
