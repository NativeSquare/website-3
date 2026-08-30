import Link from "next/link";
import BookingLink from "./BookingLink";
import NsMark from "./NsMark";
import type { Dict } from "../content";

export default function NavbarV2({ t }: { t: Dict }) {
  return (
    <header className="site-header">
      <div className="container-nav nav">
        <Link className="brand" href="/" aria-label="NativeSquare">
          <NsMark className="ns-mark" />
          <span>NativeSquare</span>
        </Link>
        <BookingLink source="navbar" className="btn btn-primary btn-sm">
          {t.nav.bookCall}
        </BookingLink>
      </div>
    </header>
  );
}
