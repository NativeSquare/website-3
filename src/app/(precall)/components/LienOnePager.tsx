"use client";

import type { ReactNode } from "react";
import posthog from "posthog-js";

/* Ouvre le one-pager dans un nouvel onglet : il se lit tout de suite, sans
   passer par le dossier Telechargements. Chaque ouverture est comptee. */
export default function LienOnePager({
  href,
  cas,
  className,
  children,
}: {
  href: string;
  cas: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={() => posthog.capture("precall_onepager_ouverture", { cas })}
    >
      {children}
    </a>
  );
}
