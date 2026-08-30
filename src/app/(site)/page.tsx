import HeroSection from "./components/HeroSection";
import FunnelGraph from "./components/FunnelGraph";
import PainSection from "./components/PainSection";
import ServicesSection from "./components/ServicesSection";
import BenefitsGrid from "./components/BenefitsGrid";
import CompareSection from "./components/CompareSection";
import FaqSection from "./components/FaqSection";
import FinalCta from "./components/FinalCta";
import { getDict } from "./locale";

export default async function Page() {
  const t = await getDict();

  return (
    <>
      <HeroSection t={t} />
      <FunnelGraph t={t} />
      <PainSection t={t} />
      <ServicesSection t={t} />
      <BenefitsGrid t={t} />
      <CompareSection t={t} />
      <FaqSection t={t} />
      <FinalCta t={t} />
    </>
  );
}
