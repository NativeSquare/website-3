"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { lireVisiteId } from "../../lib/visite";

export const BOOKING_URL =
  "https://cal.com/nativesquare-office-orlgbk/discovery-call";

/* Conversion created in LinkedIn Campaign Manager, set as an env var in Vercel.
   Left empty, clicks are simply not reported. */
const LINKEDIN_CONVERSION_ID =
  process.env.NEXT_PUBLIC_LINKEDIN_BOOKING_CONVERSION_ID;

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
    if (LINKEDIN_CONVERSION_ID) {
      window.lintrk?.("track", {
        conversion_id: Number(LINKEDIN_CONVERSION_ID),
      });
    }
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
