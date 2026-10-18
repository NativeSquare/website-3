/* Un titre ou un mot entre ** ** prend l'effet de style de la landing : un chiffre
   en bleu degrade, une phrase surlignee. Sans etat : sert au serveur (Landing) et
   au navigateur (CopieHero). */
export default function Titre({ texte }: { texte: string }) {
  return (
    <>
      {texte.split(/(\*\*[^*]+\*\*)/).map((m, i) =>
        m.startsWith("**") ? (
          <span key={i} className={/^\d/.test(m.slice(2)) ? "ld-mot ld-chiffre" : "ld-mot"}>
            {m.slice(2, -2)}
          </span>
        ) : (
          m
        ),
      )}
    </>
  );
}
