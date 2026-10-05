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
import PauseVideosButton from "@/components/PauseVideosButton";
const IndexTest = () => {
  return (
    <div className="min-h-screen">
      {/* First stop in the tab order: lets keyboard users jump the hero nav. */}
      <a href="#main" className="skip-link">דלג לתוכן העיקרי</a>
      <Analytics />
      <HomeButton />
      <main id="main">
        {/* The page needs exactly one h1. The hero headline is split across
            parallax layers for the animation, so the real one is here. */}
        <h1 className="sr-only">
          שני בסה, ניהול סושיאל מדיה ויצירת תוכן וידאו
        </h1>
        <Hero />
        <About />
        <WorkGrid />
        <ResultsReel />
        <Testimonials />
        <ContactBlock />
      </main>
      <PauseVideosButton />
      <StickyWhatsApp />
      <Footer />
    </div>
  );
};

export default IndexTest;
