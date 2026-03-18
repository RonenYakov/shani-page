import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useI18n } from "@/i18n/simple";
import { socials } from "@/content/socials";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Flowing S-curve spine — LTR sweeps left→right, RTL is mirrored
const SPINE_LTR =
  "M -150 650 C 150 300, 480 50, 750 320 C 1020 590, 1180 150, 1500 50";
const SPINE_RTL =
  "M 1450 650 C 1150 300, 820 50, 550 320 C 280 590, 120 150, -200 50";

const ResultsReel = () => {
  const { language } = useI18n();
  const isRTL = language === "he";
  const hasCalendly = Boolean(socials.calendlyUrl);

  const outerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // ── GSAP: spine draws → video rises up ────────────────────────────────
  useEffect(() => {
    const path = pathRef.current;
    const videoWrap = videoWrapRef.current;
    const outer = outerRef.current;
    if (!path || !videoWrap || !outer) return;

    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(videoWrap, { y: "102%" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outer,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    });

    // Spine draws during first 60% of scroll
    tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 0.6 }, 0);
    // Video slides up from 42% → 100%
    tl.to(videoWrap, { y: "0%", ease: "power2.inOut", duration: 0.58 }, 0.42);

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // ── Auto-mute when video leaves viewport ──────────────────────────────
  useEffect(() => {
    const el = videoWrapRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          setIsMuted(true);
          if (videoRef.current) videoRef.current.muted = true;
        }
      },
      { threshold: 0.25 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

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

  return (
    // Outer — taller than viewport, creates scroll space for GSAP scrub
    <div
      ref={outerRef}
      id="results"
      style={{ height: "280vh", position: "relative", background: "var(--color-cream-dark)" }}
    >
      {/* Sticky wrapper — 100vh, both spine and video live here */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* ── Spine layer ────────────────────────────────────────────────── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--color-cream-dark)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 1300 700"
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          >
            <path
              ref={pathRef}
              d={isRTL ? SPINE_RTL : SPINE_LTR}
              fill="none"
              stroke="var(--color-orange)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Subtle label visible while spine is drawing */}
          <p
            style={{
              position: "relative",
              zIndex: 1,
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "rgba(26,24,20,0.18)",
              userSelect: "none",
            }}
          >
            {isRTL ? "ממשיכים לתוצאות" : "continuing to results"}
          </p>
        </div>

        {/* ── Video layer — slides up from below, covers spine ────────────── */}
        <div
          ref={videoWrapRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--color-cream)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(24px, 3vw, 48px) var(--base-padding-x)",
            gap: "clamp(14px, 2vw, 28px)",
          }}
        >
          {/* Section label + title */}
          <div
            dir={isRTL ? "rtl" : "ltr"}
            style={{ width: "100%", maxWidth: "900px" }}
          >
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.68rem",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--color-orange)",
              margin: "0 0 0.75rem",
            }}>
              — 03 / RESULTS
            </p>
            <div style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "clamp(1.8rem, 3.2vw, 3.8rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: "var(--color-ink)",
              borderBottom: "3px solid var(--color-orange)",
              paddingBottom: "0.15em",
              display: "inline-block",
            }}>
              {isRTL ? "ככה נראות תוצאות" : "What Results Look Like"}
            </div>
          </div>

          {/* Video */}
          <div style={{
            position: "relative",
            borderRadius: 20,
            overflow: "hidden",
            width: "100%",
            maxWidth: "900px",
            boxShadow: "0 40px 80px rgba(26,24,20,0.14)",
            flexShrink: 0,
          }}>
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
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(26,24,20,0.5) 0%, transparent 50%)",
              pointerEvents: "none",
            }} />
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
          </div>

          {/* Calendly CTA */}
          {hasCalendly && (
            <button
              onClick={() => socials.calendlyUrl && window.open(socials.calendlyUrl, "_blank")}
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
                flexShrink: 0,
              }}
            >
              {isRTL ? "קבעו שיחת היכרות קצרה" : "Book a quick call"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsReel;
