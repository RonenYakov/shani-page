import Hero from "@/components/Hero";
import HomeButton from "@/components/HomeButton";
import { lazy, Suspense, useEffect } from "react";
import StickyWhatsApp from "@/components/StickyWhatsApp";
import Analytics from "@/components/Analytics";

// Everything below the hero loads in its own chunk so the first paint
// only pays for the hero.
const loadBelowFold = () => import("./IndexBelowFold");
const BelowFold = lazy(loadBelowFold);
const Footer = lazy(() => import("@/components/Footer"));
const PauseVideosButton = lazy(() => import("@/components/PauseVideosButton"));

const IndexTest = () => {
  // start fetching right after first paint so #anchors resolve quickly
  useEffect(() => {
    const t = window.setTimeout(loadBelowFold, 0);
    return () => window.clearTimeout(t);
  }, []);

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
        <Suspense fallback={null}>
          <BelowFold />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <PauseVideosButton />
      </Suspense>
      <StickyWhatsApp />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default IndexTest;
