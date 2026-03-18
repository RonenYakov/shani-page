import { useI18n } from "@/i18n/simple";
import { socials } from "@/content/socials";
import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

const ResultsReel = () => {
  const { language } = useI18n();
  const isRTL = language === "he";
  const hasCalendly = Boolean(socials.calendlyUrl);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef as React.RefObject<Element>, { once: true, margin: "-80px" });

  const handleCalendly = () => {
    if (socials.calendlyUrl) window.open(socials.calendlyUrl, "_blank");
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    setIsMuted(next);
    v.muted = next;
    if (!next) {
      try {
        v.volume = 1;
        void v.play();
      } catch {}
    }
  };

  // Auto-mute when section leaves viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          setIsMuted(true);
          if (videoRef.current) videoRef.current.muted = true;
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="results"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background: "var(--color-cream)",
        padding: "clamp(70px, 9vw, 120px) var(--base-padding-x)",
      }}
    >
      {/* Section label */}
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--color-orange)",
          marginBottom: "1rem",
        }}
      >
        — 03 / RESULTS
      </motion.p>

      {/* Title */}
      <div style={{ overflow: "hidden", marginBottom: "clamp(36px, 4vw, 56px)" }}>
        <motion.h2
          initial={{ y: "110%" }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: "clamp(2.8rem, 6.5vw, 6.5rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            color: "var(--color-ink)",
            margin: 0,
            borderBottom: "3px solid var(--color-orange)",
            paddingBottom: "0.15em",
            display: "inline-block",
          }}
        >
          {isRTL ? "ככה נראות תוצאות" : "What Results Look Like"}
        </motion.h2>
      </div>

      {/* Video container */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        style={{
          position: "relative",
          borderRadius: 20,
          overflow: "hidden",
          maxWidth: "900px",
          margin: "0 auto",
          boxShadow: "0 40px 80px rgba(26,24,20,0.14)",
        }}
      >
        <video
          ref={videoRef}
          style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }}
          src="/recomendations.mp4"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
        />

        {/* Subtle dark overlay for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(26,24,20,0.5) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        {/* Mute toggle */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? (isRTL ? "הפעל קול" : "Unmute") : (isRTL ? "השתק" : "Mute")}
          style={{
            position: "absolute",
            bottom: "1rem",
            insetInlineEnd: "1rem",
            zIndex: 10,
            width: "2.75rem",
            height: "2.75rem",
            borderRadius: "50%",
            background: "rgba(26,24,20,0.55)",
            border: "1px solid rgba(245,240,232,0.2)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--color-cream)",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,24,20,0.75)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(26,24,20,0.55)")}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </motion.div>

      {/* CTA */}
      {hasCalendly && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          style={{ textAlign: "center", marginTop: "2.5rem" }}
        >
          <button
            onClick={handleCalendly}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "var(--color-orange)",
              color: "white",
              border: "none",
              borderRadius: "9999px",
              padding: "0.9rem 2.2rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            {isRTL ? "קבעו שיחת היכרות קצרה" : "Book a quick call"}
          </button>
        </motion.div>
      )}
    </section>
  );
};

export default ResultsReel;
