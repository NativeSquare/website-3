"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

export const BOOKING_URL =
  "https://cal.com/nativesquare-office-orlgbk/discovery-call";

/* Conversion created in LinkedIn Campaign Manager, set as an env var in Vercel.
   Left empty, clicks are simply not reported. */
const LINKEDIN_CONVERSION_ID =
  process.env.NEXT_PUBLIC_LINKEDIN_BOOKING_CONVERSION_ID;

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
   conversion, which is what lets campaigns and creatives be compared. */
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
