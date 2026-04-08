import Hero from "./Hero";
import LogoBar from "./LogoBar";
import WhatWeDo from "./WhatWeDo";
import ProductShowcase from "./ProductShowcase";
import CaseStudies from "./CaseStudies";
import Services from "./Services";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import CTA from "./CTA";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <LogoBar />
      <WhatWeDo />
      <ProductShowcase />
      <CaseStudies />
      <Services />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
};

export default Home;
