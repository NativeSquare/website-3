"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  EMAIL_1,
  EMAIL_2,
  EMAIL_3,
  RAPPEL_APPEL,
  SMS_1,
  SMS_2,
  SMS_3,
  heure,
  heureParis,
  heureParisCourte,
  type Contact,
} from "../../../../lib/sequence-messages";

/* Les fuseaux ou on appelle. Le libelle est celui qu'un patron americain
   emploie ; la valeur est le fuseau IANA que Cal.com attend. */
const FUSEAUX = [
  { valeur: "America/New_York", court: "ET", libelle: "Eastern" },
  { valeur: "America/Chicago", court: "CT", libelle: "Central" },
  { valeur: "America/Denver", court: "MT", libelle: "Mountain" },
  { valeur: "America/Los_Angeles", court: "PT", libelle: "Pacific" },
  { valeur: "Europe/Paris", court: "FR", libelle: "France" },
];

type Creneaux = Record<string, Array<{ start: string }>>;

function numeroPropre(saisi: string): string {
  const chiffres = saisi.replace(/[^\d+]/g, "");
  if (chiffres.startsWith("+")) return chiffres;
  if (chiffres.length === 10) return `+1${chiffres}`;
  if (chiffres.length === 11 && chiffres.startsWith("1")) return `+${chiffres}`;
  return chiffres;
}

export default function Booker() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [note, setNote] = useState("");
  const [fuseau, setFuseau] = useState(FUSEAUX[0].valeur);

  const [creneaux, setCreneaux] = useState<Creneaux>({});
  const [chargement, setChargement] = useState(false);
  const [creneau, setCreneau] = useState("");
  const [erreur, setErreur] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [fait, setFait] = useState<{ uid: string; etapes: string[] } | null>(null);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur("");
    try {
      const reponse = await fetch(`/api/interne/creneaux?fuseau=${encodeURIComponent(fuseau)}`);
      const donnees = await reponse.json();
      if (!reponse.ok) throw new Error(donnees.detail || donnees.erreur || "erreur");
      setCreneaux(donnees.creneaux as Creneaux);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "erreur");
      setCreneaux({});
    }
    setChargement(false);
  }, [fuseau]);

  useEffect(() => {
    void charger();
    setCreneau("");
  }, [charger]);

  const contact: Contact | null = useMemo(() => {
    if (!creneau || !prenom) return null;
    return {
      prenom,
      entreprise: entreprise || undefined,
      note: note || undefined,
      debut: creneau,
      fuseau,
    };
  }, [creneau, prenom, entreprise, note, fuseau]);

  const apercu = useMemo(() => {
    if (!contact) return [];
    return [
      { titre: "Email 1 · tout de suite", ...EMAIL_1(contact) },
      { titre: "Texto 1 · tout de suite", ...SMS_1(contact) },
      { titre: "Email 2 · à mi-chemin", ...EMAIL_2(contact) },
      { titre: "Texto 2 · à mi-chemin", ...SMS_2(contact) },
      {
        titre: "Texto pour toi · 2 h avant",
        ...RAPPEL_APPEL({
          ...contact,
          telephone: telephone ? numeroPropre(telephone) : undefined,
          nomComplet: [prenom, nom].filter(Boolean).join(" "),
        }),
      },
      { titre: "Email 3 · 30 min avant", ...EMAIL_3(contact) },
      { titre: "Texto 3 · 30 min avant", ...SMS_3(contact) },
    ];
  }, [contact, telephone, prenom, nom]);

  const pret = Boolean(prenom && email && creneau);

  async function reserver() {
    setEnvoi(true);
    setErreur("");
    try {
      const reponse = await fetch("/api/interne/reserver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom,
          nom: nom || undefined,
          email,
          telephone: telephone ? numeroPropre(telephone) : undefined,
          entreprise: entreprise || undefined,
          note: note || undefined,
          fuseau,
          debut: creneau,
        }),
      });
      const donnees = await reponse.json();
      if (!reponse.ok) throw new Error(donnees.detail || donnees.erreur || "erreur");
      setFait({ uid: donnees.uid, etapes: donnees.etapes ?? [] });
    } catch (e) {
      setErreur(e instanceof Error ? e.message : "erreur");
    }
    setEnvoi(false);
  }

  if (fait) {
    return (
      <div className="bk-wrap bk-fini">
        <div className="pill">Réservé</div>
        <h1>C&apos;est booké. Ne raccroche pas tout de suite.</h1>
        <p className="bk-lock">
          « I just sent you over that email confirmation. Can you make sure you got it on your
          end? »
        </p>
        <p className="bk-lock dim">
          Puis : « Got the confirmation on my end. {prenom}, I&apos;ll see you{" "}
          {creneau ? heure(creneau, fuseau) : ""}. »
        </p>
        <ul className="bk-recap">
          <li>
            Cal.com a envoyé la confirmation à <b>{email}</b>.
          </li>
          <li>
            {apercu.length ? `${fait.etapes.length} envois programmés` : "Séquence programmée"} :
            email et texto tout de suite, à mi-chemin, 30 minutes avant, plus ton rappel d&apos;appel
            2 h avant.
          </li>
          <li>
            Rendez-vous chez toi le <b>{creneau ? heureParis(creneau) : ""}</b>.
          </li>
        </ul>
        <button className="btn btn-primary" onClick={() => location.reload()}>
          Booker le suivant
        </button>
      </div>
    );
  }

  return (
    <div className="bk-wrap">
      <div className="bk-col">
        <div className="pill">Pendant l&apos;appel</div>
        <h1>Booker un audit</h1>

        <div className="bk-form">
          <label>
            Prénom
            <input value={prenom} onChange={(e) => setPrenom(e.target.value)} autoFocus />
          </label>
          <label>
            Nom
            <input value={nom} onChange={(e) => setNom(e.target.value)} />
          </label>
          <label className="bk-large">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Portable
            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="407 555 0134"
            />
          </label>
          <label>
            Entreprise
            <input value={entreprise} onChange={(e) => setEntreprise(e.target.value)} />
          </label>
          <label className="bk-large">
            Ce qu&apos;il t&apos;a dit <span>facultatif, repris dans le texto 2</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="the two trucks you just added"
            />
          </label>
        </div>

        <div className="bk-fuseaux">
          {FUSEAUX.map((f) => (
            <button
              key={f.valeur}
              className={fuseau === f.valeur ? "on" : ""}
              onClick={() => setFuseau(f.valeur)}
            >
              {f.libelle}
            </button>
          ))}
        </div>

        <div className="bk-creneaux">
          {chargement && <p className="bk-vide">Chargement des créneaux…</p>}
          {!chargement && Object.keys(creneaux).length === 0 && (
            <p className="bk-vide">Aucun créneau libre sur les dix prochains jours.</p>
          )}
          {Object.entries(creneaux).map(([jour, liste]) => (
            <div key={jour} className="bk-jour">
              <h3>
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  timeZone: fuseau,
                }).format(new Date(`${jour}T12:00:00Z`))}
              </h3>
              <div className="bk-heures">
                {liste.map((s) => (
                  <button
                    key={s.start}
                    className={creneau === s.start ? "on" : ""}
                    onClick={() => setCreneau(s.start)}
                  >
                    <b>{heure(s.start, fuseau)}</b>
                    <span>{heureParisCourte(s.start)} chez toi</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bk-col bk-apercu">
        <div className="pill">Ce qui partira</div>
        {!contact && (
          <p className="bk-vide">Renseigne au moins le prénom et choisis un créneau.</p>
        )}
        {apercu.map((m) => (
          <article key={m.titre}>
            <h4>{m.titre}</h4>
            {m.objet && <p className="bk-objet">{m.objet}</p>}
            <pre>{m.texte}</pre>
          </article>
        ))}

        {erreur && <p className="bk-erreur">{erreur}</p>}
        <button className="btn btn-primary bk-valider" disabled={!pret || envoi} onClick={reserver}>
          {envoi ? "Réservation…" : "Réserver et lancer la séquence"}
        </button>
        {!telephone && pret && (
          <p className="bk-avert">Sans portable, seuls les emails partiront.</p>
        )}
      </div>
    </div>
  );
}
