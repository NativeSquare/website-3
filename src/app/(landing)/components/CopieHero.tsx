"use client";

import { useTunnel } from "./EtatTunnel";
import Titre from "./Titre";

/**
 * L'accroche du haut de la landing. Tant que la personne n'est pas a l'ecran du
 * contact, c'est l'accroche de la page (`defaut`, rendue par le serveur : pastille,
 * titre, sous-titre, rarete).
 *
 * A l'ecran du contact, elle est remplacee par l'annonce « votre zone est
 * disponible » (le moment ou la personne a gagne quelque chose, et la raison de
 * lui demander ses coordonnees) : une coche verte qui jaillit avec une pluie de
 * confettis, le titre en vert, puis le sous-titre. Plus de pastille « Limited
 * offer », plus de rarete : la seule suite logique est de laisser ses coordonnees.
 *
 * Sur les ecrans de qualification qui suivent, il ne reste qu'une ligne : repondre
 * pour reserver. Au calendrier, il ne reste rien : que « Pick a time ».
 * Sans titre ni sous-titre (landings qui n'en ont pas), rien ne change.
 */

/* Les confettis : le point d'arrivee (dx, dy), le tour sur eux-memes, la couleur
   et le retard. Fixes, pour que le rendu soit le meme a chaque fois. */
const CONFETTIS = [
  { dx: -150, dy: -60, r: -240, c: "#0A84FF", d: 0 },
  { dx: -110, dy: -110, r: 200, c: "#FFB020", d: 40 },
  { dx: -70, dy: -140, r: -160, c: "#22C55E", d: 80 },
  { dx: -25, dy: -160, r: 280, c: "#FACC15", d: 20 },
  { dx: 25, dy: -160, r: -280, c: "#0A84FF", d: 60 },
  { dx: 70, dy: -140, r: 160, c: "#FF7A2F", d: 100 },
  { dx: 110, dy: -110, r: -200, c: "#22C55E", d: 30 },
  { dx: 150, dy: -60, r: 240, c: "#FACC15", d: 70 },
  { dx: -170, dy: 10, r: 180, c: "#FF7A2F", d: 90 },
  { dx: 170, dy: 10, r: -180, c: "#0A84FF", d: 50 },
  { dx: -95, dy: -75, r: 320, c: "#FACC15", d: 120 },
  { dx: 95, dy: -75, r: -320, c: "#22C55E", d: 110 },
  { dx: -45, dy: -105, r: -120, c: "#FF7A2F", d: 140 },
  { dx: 45, dy: -105, r: 120, c: "#0A84FF", d: 130 },
];

export default function CopieHero({
  defaut,
  titre,
  sousTitre,
  sousTitreQuestions,
}: {
  defaut: React.ReactNode;
  /* « {zone} » devient la zone saisie, ** ** met un mot en avant. */
  titre?: string;
  sousTitre?: string;
  /* La seule ligne gardee en haut pendant les ecrans de qualification. */
  sousTitreQuestions?: string;
}) {
  const { contact, questions, calendrier, zone } = useTunnel();

  if (calendrier) return null;
  if (questions && sousTitreQuestions) {
    return <p className="lead ld-seul">{sousTitreQuestions}</p>;
  }
  if (!contact || !titre || !sousTitre) return <>{defaut}</>;

  const zoneAffichee = zone.trim().length <= 40 ? zone.trim() : "";
  return (
    <>
      <div className="ld-bravo-tete" aria-hidden="true">
        <span className="ld-coche">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className="ld-fete">
          {CONFETTIS.map((k, i) => (
            <i
              key={i}
              style={
                {
                  "--dx": `${k.dx}px`,
                  "--dy": `${k.dy}px`,
                  "--r": `${k.r}deg`,
                  background: k.c,
                  animationDelay: `${k.d}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </span>
      </div>
      <h1 className="ld-bravo">
        <Titre texte={titre.replace("{zone}", zoneAffichee || "your area")} />
      </h1>
      <h2 className="lead">{sousTitre}</h2>
    </>
  );
}
