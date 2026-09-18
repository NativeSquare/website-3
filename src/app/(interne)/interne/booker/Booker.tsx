"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { enveloppe } from "../../../../lib/sequence-email";
import {
  EMAIL_1,
  EMAIL_2,
  EMAIL_3,
  SMS_1,
  SMS_2,
  SMS_3,
  heure,
  heureParis,
  heureParisCourte,
  type Contact,
  type Message,
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

/* Une carte de l'apercu : les emails portent leur rendu, les textos non. */
type Carte = {
  titre: string;
  objet?: string;
  texte: string;
  html?: string;
  indice?: string;
};

function numeroPropre(saisi: string): string {
  const chiffres = saisi.replace(/[^\d+]/g, "");
  if (chiffres.startsWith("+")) return chiffres;
  if (chiffres.length === 10) return `+1${chiffres}`;
  if (chiffres.length === 11 && chiffres.startsWith("1")) return `+${chiffres}`;
  return chiffres;
}

/* L'heure chez Alexandre. Un creneau de fin de journee americaine tombe le
   lendemain a Paris : dans ce cas on nomme le jour, pour ne pas lire 03:30
   comme s'il s'agissait du matin meme. */
function chezToi(iso: string, fuseau: string): string {
  const jourLaBas = new Intl.DateTimeFormat("fr-FR", { weekday: "short", timeZone: fuseau }).format(
    new Date(iso),
  );
  const jourIci = new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
  const h = heureParisCourte(iso);
  return jourLaBas === jourIci ? h + " chez toi" : jourIci + " " + h + " chez toi";
}

function carteEmail(titre: string, m: Message, indice?: string): Carte {
  return {
    titre,
    objet: m.objet,
    texte: m.texte,
    indice,
    html: m.paragraphes
      ? enveloppe({ paragraphes: m.paragraphes, bouton: m.bouton, signature: m.signature })
      : undefined,
  };
}

/* L'email tel qu'il arrivera, dans son propre document : les styles en ligne
   de l'envoi ne croisent pas ceux du site. */
function RenduEmail({ html }: { html: string }) {
  const [hauteur, setHauteur] = useState(360);
  return (
    <iframe
      className="bk-mail"
      title="Rendu de l'email"
      srcDoc={html}
      style={{ height: hauteur }}
      onLoad={(e) => {
        const doc = e.currentTarget.contentDocument;
        if (doc) setHauteur(doc.documentElement.scrollHeight + 4);
      }}
    />
  );
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

  const apercu = useMemo<Carte[]>(() => {
    if (!contact) return [];
    return [
      { titre: "Texto 1 · tout de suite", ...SMS_1(contact) },
      carteEmail(
        "Email 1 · dix minutes après",
        EMAIL_1(contact),
        "Dix minutes de décalage pour ne pas tomber dans la même minute que la confirmation Cal.com.",
      ),
      carteEmail("Email 2 · à mi-chemin", EMAIL_2(contact)),
      { titre: "Texto 2 · à mi-chemin", ...SMS_2(contact) },
      carteEmail(
        "Email 3 · 30 min avant",
        EMAIL_3(contact),
        "Dans l'envoi réel, la première phrase porte le lien de visio Cal.com.",
      ),
      { titre: "Texto 3 · 30 min avant", ...SMS_3(contact) },
    ];
  }, [contact]);

  const pret = Boolean(prenom && email && creneau);
  const nomComplet = [prenom, nom].filter(Boolean).join(" ");

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
            Cal.com vient d&apos;envoyer sa confirmation à <b>{email}</b> : la date, le lien de
            visio et le fichier agenda.
          </li>
          <li>
            {fait.etapes.length} envois programmés : le texto tout de suite, ton email dix minutes
            après, puis email et texto à mi-chemin et 30 minutes avant.
          </li>
          <li>
            L&apos;appel est déjà dans <b>Prospect Calls</b> (« Free audit with{" "}
            {nomComplet || prenom} »), avec les notifications la veille et une heure avant.
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
                    <span>{chezToi(s.start, fuseau)}</span>
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

        {contact && (
          <article className="bk-agenda">
            <h4>Ton agenda · dès la réservation</h4>
            <p className="bk-objet">Free audit with {nomComplet || prenom}</p>
            <pre>
              {[
                `${heureParis(contact.debut)} chez toi, ${heure(contact.debut, fuseau)} chez lui.`,
                "Calendrier Prospect Calls, notifications la veille et une heure avant.",
                telephone
                  ? `Une heure avant, tu l'appelles au ${numeroPropre(telephone)}.`
                  : "Sans portable saisi, tu n'auras pas son numéro sous les yeux.",
              ].join("\n")}
            </pre>
          </article>
        )}

        {apercu.map((m) => (
          <article key={m.titre} className={m.html ? "bk-courriel" : undefined}>
            <h4>{m.titre}</h4>
            {m.objet && <p className="bk-objet">{m.objet}</p>}
            {m.html ? (
              <>
                <RenduEmail html={m.html} />
                <details className="bk-texte">
                  <summary>Version texte</summary>
                  <pre>{m.texte}</pre>
                </details>
              </>
            ) : (
              <pre>{m.texte}</pre>
            )}
            {m.indice && <p className="bk-indice">{m.indice}</p>}
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
