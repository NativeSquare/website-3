"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import posthog from "posthog-js";
import { lireLanding, lireVisiteId } from "../../lib/visite";

/* Conversion « reservation-appel » creee dans Campaign Manager le 21/08/2026,
   declenchement par evenement. Identifiant public, il part de toute facon dans
   le navigateur : ecrit en dur comme le tag partenaire de l'Insight Tag, une
   variable d'environnement de moins a oublier au deploiement. */
const LINKEDIN_CONVERSION_ID = 29592730;

/* Le formulaire general : coordonnees obligatoires, quelques questions, puis le
   calendrier. Personne ne reserve sans avoir laisse de quoi le recontacter. */
export const PAGE_RESERVATION = "/book";

type BookingLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "target" | "rel"
> & {
  /* Which button was clicked — kept on the element so analytics can tell the
     hero button from the navbar one. */
  source: string;
  children: ReactNode;
};

/* The one place every « Book a call » button sends people. It never opens the
   calendar directly:
     - someone who arrived through a campaign (cookie `ns_landing`, set by
       `/api/visite`) goes back to that campaign's form, whatever pages they
       visited since;
     - everyone else goes to the general form, `/book`.
   Meta no longer gets a « Lead » from the click: the lead is the form's
   contact step, which is saved on our side and alerts Slack.
   Every click is still reported to LinkedIn as a conversion. */
const BookingLink: React.FC<BookingLinkProps> = ({
  source,
  children,
  onClick,
  ...props
}) => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    window.lintrk?.("track", { conversion_id: LINKEDIN_CONVERSION_ID });
    onClick?.(event);

    const landing = lireLanding();
    posthog.capture("reservation_clic", {
      source,
      visiteId: lireVisiteId(),
      destination: landing ?? PAGE_RESERVATION,
    });
    /* Sans cookie, le lien fait son travail normalement (vers /book). Un clic
       avec une touche modificatrice ouvre un onglet a part : on le laisse. */
    if (!landing || event.defaultPrevented || event.metaKey || event.ctrlKey) {
      return;
    }
    event.preventDefault();
    window.location.assign(`${landing}#book`);
  };

  return (
    <a
      href={PAGE_RESERVATION}
      data-booking-source={source}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default BookingLink;
