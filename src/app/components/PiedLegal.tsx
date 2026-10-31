import Link from "next/link";

/**
 * Le pied de page des pages de pub (`/hvac`, `/before-our-call`, `/cases`...).
 * L'enregistrement A2P demande que le site montre clairement le nom de
 * l'entreprise, son nom commercial, ses coordonnees, et des liens vers la
 * politique de confidentialite et les conditions. Memes informations que
 * `/legal?section=mentions`.
 */
export default function PiedLegal() {
  return (
    <footer className="bc-footer">
      <div className="container-nav">
        <span>
          © NativeSquare SAS, doing business as NativeSquare · 60 rue François Ier,
          75008 Paris, France · office@nativesquare.fr ·{" "}
          <a href="tel:+12187724594">+1 218-772-4594</a>
        </span>
        <span className="bc-footer-liens">
          <Link href="/legal?section=privacy">Privacy Policy</Link>
          <Link href="/legal?section=terms">Terms of Service</Link>
          <Link href="/legal">Legal</Link>
        </span>
      </div>
    </footer>
  );
}
