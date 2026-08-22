"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { lireVisiteId } from "../../lib/visite";

export const BOOKING_URL =
  "https://cal.com/nativesquare-office-orlgbk/discovery-call";

/* Conversion « reservation-appel » creee dans Campaign Manager le 21/08/2026,
   declenchement par evenement. Identifiant public, il part de toute facon dans
   le navigateur : ecrit en dur comme le tag partenaire de l'Insight Tag, une
   variable d'environnement de moins a oublier au deploiement. */
const LINKEDIN_CONVERSION_ID = 29592730;

/* Identifiant de la question de reservation cote Cal.com, sous
   Advanced -> Booking Questions. Cal.com preremplit un champ par son
   identifiant passe en parametre d'URL.
   Doc : https://cal.com/help/bookings/prefill-fields */
const CHAMP_CAL_VISITE = "visite";

type BookingLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel"
> & {
  /* Which button was clicked — kept on the element so analytics can tell the
     hero button from the navbar one. */
  source: string;
  children: ReactNode;
};

/* The one place the booking URL lives. Every click is reported to LinkedIn as a
   conversion, which is what lets campaigns and creatives be compared.

   L'identifiant de visite est accroche au moment du clic, pas au rendu : le
   cookie est pose par `/api/visite` apres le montage de la page. */
const BookingLink: React.FC<BookingLinkProps> = ({
  source,
  children,
  onClick,
  ...props
}) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    window.lintrk?.("track", { conversion_id: LINKEDIN_CONVERSION_ID });
    onClick?.(event);

    const visiteId = lireVisiteId();
    /* Sans identifiant, ou si l'utilisateur ouvre dans un onglet a lui, on
       laisse le lien faire son travail normalement. */
    if (!visiteId || event.defaultPrevented || event.metaKey || event.ctrlKey) {
      return;
    }

    const url = new URL(BOOKING_URL);
    url.searchParams.set(CHAMP_CAL_VISITE, visiteId);
    url.searchParams.set("ns_source", source);
    event.preventDefault();
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      data-booking-source={source}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default BookingLink;
