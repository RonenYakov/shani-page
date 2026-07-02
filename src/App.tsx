import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig, motion } from "framer-motion";
import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import "lenis/dist/lenis.css";
import IndexTest from "./pages/IndexTest";
import Process from "./pages/Process";
import Faq from "./pages/Faq";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Shared scroll restoration — routes every page change through Lenis when active. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return null;
};

/** Enter-only route fade — no exit animations (exit + smooth scroll = jank). */
const AppRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <div className="grain-overlay" aria-hidden="true" />}
      <ScrollToTop />
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <Routes location={location}>
          <Route path="/" element={<IndexTest />} />
          <Route path="/process" element={<Process />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </>
  );
};

/** Lenis smooth scroll on the marketing pages — skipped for reduced motion and /admin.
 *  Touch stays native (no syncTouch), protecting the Hero touch parallax. */
const SmoothShell = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin || prefersReducedMotion()) return <AppRoutes />;
  return (
    <ReactLenis root options={{ lerp: 0.09, smoothWheel: true, anchors: true }}>
      <AppRoutes />
    </ReactLenis>
  );
};

const App = () => (
  <MotionConfig reducedMotion="user">
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SmoothShell />
      </BrowserRouter>
    </TooltipProvider>
  </MotionConfig>
);

export default App;
