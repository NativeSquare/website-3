import NavbarV2 from "./components/NavbarV2";
import FooterV2 from "./components/FooterV2";
import { getDict } from "./locale";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getDict();

  return (
    <>
      <NavbarV2 t={t} />
      <main className="site-main">{children}</main>
      <FooterV2 t={t} />
    </>
  );
}
