import HeroAbout from "@/components/HeroAbout";
import WorkGrid from "@/components/work/WorkGrid";
import ProcessTimeline from "@/components/ProcessTimeline";
import ResultsReel from "@/components/ResultsReel";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactBlock from "@/components/ContactBlock";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import Analytics from "@/components/Analytics";
import Footer from "@/components/Footer";
import IntroShutter from "@/components/IntroShutter";

const IndexTest = () => {
  return (
    <div className="min-h-screen">
      <IntroShutter />
      <Analytics />
      <HeroAbout />
      <WorkGrid />
      <ProcessTimeline />
      <ResultsReel />
      <Testimonials />
      <FAQ />
      <ContactBlock />
      <StickyWhatsApp />
      <Footer />
    </div>
  );
};

export default IndexTest;
