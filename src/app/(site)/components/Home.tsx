import Hero from "./Hero";
import Features from "./Features";
import MobileSection from "./MobileSection";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import CTA from "./CTA";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <Features />
      <Testimonials />
      <MobileSection />
      <FAQ />
      <CTA />
    </>
  );
};

export default Home;
