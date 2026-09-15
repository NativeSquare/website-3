import Legal from "../components/Legal";

const SECTIONS = ["mentions", "terms", "privacy", "cookies"];

/* ?section=privacy ouvre directement la politique de confidentialité. */
export default async function LegalPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;
  const initialSection = section && SECTIONS.includes(section) ? section : "mentions";
  return <Legal initialSection={initialSection} />;
}
