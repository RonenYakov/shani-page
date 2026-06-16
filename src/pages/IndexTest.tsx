import Hero from "@/components/Hero";
import HomeButton from "@/components/HomeButton";
import About from "@/components/About";
import WorkGrid from "@/components/work/WorkGrid";
import ResultsReel from "@/components/ResultsReel";
import Testimonials from "@/components/Testimonials";
import ContactBlock from "@/components/ContactBlock";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
const IndexTest = () => {
  return (
    <div className="min-h-screen">
      <div className="grain-overlay" aria-hidden="true" />
      <Analytics />
      <HomeButton />
      <Hero />
      <About />
      <WorkGrid />
      <ResultsReel />
      <Testimonials />
      <ContactBlock />
      <StickyWhatsApp />
      <Footer />
    </div>
  );
};

export default IndexTest;
