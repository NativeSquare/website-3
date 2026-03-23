import Hero from "./Hero";
import KPISection from "./KPISection";
import OurWork from "./OurWork";
import Benefits from "./Benefits";
import Features from "./Features";
import MobileSection from "./MobileSection";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import CTA from "./CTA";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <KPISection />
      <OurWork />
      <Benefits />
      <Testimonials />
      <MobileSection />
      <FAQ />
      <CTA />
    </>
  );
};

export default Home;
