import HeroWorking from "@/components/HeroWorking";
import About from "@/components/About";
import ProcessTimeline from "@/components/ProcessTimeline";
import BrandsVideoCarousel from "@/components/BrandsVideoCarousel";
import WeddingsVideoGallery from "@/components/WeddingsVideoGallery";
import ResultsReel from "@/components/ResultsReel";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactBlock from "@/components/ContactBlock";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";

const IndexTest = () => {
  return (
    <div className="min-h-screen">
      <Analytics />
      <HeroWorking />
      <About />
      <BrandsVideoCarousel />
      <WeddingsVideoGallery />
      <ResultsReel />
      <ProcessTimeline />
      <Testimonials />
      <FAQ />
      <ContactBlock />
      <StickyWhatsApp />
      <Footer />
    </div>
  );
};

export default IndexTest;
