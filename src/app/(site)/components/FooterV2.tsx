import Link from "next/link";
import NsMark from "./NsMark";
import type { Dict } from "../content";

export default function FooterV2({ t }: { t: Dict }) {
  return (
    <footer className="site-footer">
      {/* Template arch pattern (bg-pattern.svg ≥640px, bg-pattern-mobile.svg below) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="footer-pattern" src="/art/footer-pattern.svg" alt="" aria-hidden="true" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="footer-pattern mobile" src="/art/footer-pattern-mobile.svg" alt="" aria-hidden="true" />
      <span className="aurora a-periwinkle" aria-hidden="true"></span>
      <span className="aurora a-rose" aria-hidden="true"></span>
      <span className="aurora a-orange" aria-hidden="true"></span>
      <span className="aurora a-cyan" aria-hidden="true"></span>
      <div className="footer-inner">
        <div className="footer-top">
          <Link className="footer-brand" href="/" aria-label="NativeSquare">
            <NsMark className="ns-mark" />
            <span>NativeSquare</span>
          </Link>
        </div>
        <div className="footer-bottom">
          <p>© NativeSquare</p>
          <div className="footer-links">
            <Link href="/legal">{t.footer.privacy}</Link>
            <Link href="/legal">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
