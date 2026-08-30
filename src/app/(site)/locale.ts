import { headers } from "next/headers";
import { content, resolveLocale, type Dict, type Locale } from "./content";

/* Lecture côté serveur de la langue négociée par src/middleware.ts. */
export async function getLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  return resolveLocale(requestHeaders.get("x-ns-locale"));
}

export async function getDict(): Promise<Dict> {
  return content[await getLocale()];
}
