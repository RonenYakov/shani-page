import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useI18n } from "@/i18n/simple";
import { socials } from "@/content/socials";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Spine path — large organic loop, exits right ────────────────────────
// LTR: enters top-center, makes a clockwise loop left, tail sweeps right
const SPINE_LTR =
  "M 500 -80 " +
  "C 820 20, 1000 260, 820 480 " +   // sweep right and down
  "C 640 700, 280 720, 100 520 " +   // arc left, loop bottom
  "C -80 320, 30 90, 240 50 " +      // close loop, arc up
  "C 420 10, 580 200, 740 460 " +    // exit the loop
  "C 900 700, 1150 600, 1450 380";   // sweep right off-screen

// RTL: mirror of LTR
const SPINE_RTL =
  "M 900 -80 " +
  "C 580 20, 400 260, 580 480 " +
  "C 760 700, 1120 720, 1300 520 " +
  "C 1480 320, 1370 90, 1160 50 " +
  "C 980 10, 820 200, 660 460 " +
  "C 500 700, 250 600, -50 380";

const ResultsReel = () => {
  const { language } = useI18n();
  const isRTL = language === "he";
  const hasCalendly = Boolean(socials.calendlyUrl);

  const outerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // ── GSAP: spine draws, then giant video frame rises from below ─────
  useEffect(() => {
    const path = pathRef.current;
    const videoWrap = videoWrapRef.current;
    const outer = outerRef.current;
    if (!path || !videoWrap || !outer) return;

    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.set(videoWrap, { y: "105%" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outer,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.4,
      },
    });

    tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 0.6 }, 0);
    tl.to(videoWrap, { y: "0%", ease: "power2.inOut", duration: 0.55 }, 0.44);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  // ── Auto-mute when off screen ──────────────────────────────────────
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
      try { v.volume = 1; void v.play(); } catch {}
    }
  };

  return (
    <div
      ref={outerRef}
      id="results"
      style={{ height: "260vh", position: "relative", background: "var(--color-cream-dark)" }}
    >
      {/* Sticky container — both layers live here */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* ── Layer 1: Spine ─────────────────────────────────────────── */}
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
            viewBox="0 0 1400 800"
            preserveAspectRatio="xMidYMid slice"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          >
            <path
              ref={pathRef}
              d={isRTL ? SPINE_RTL : SPINE_LTR}
              fill="none"
              stroke="var(--color-orange)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p style={{
            position: "relative",
            zIndex: 1,
            fontFamily: "var(--font-mono)",
            fontSize: "0.56rem",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "rgba(26,24,20,0.16)",
            userSelect: "none",
          }}>
            {isRTL ? "ממשיכים לתוצאות" : "continuing to results"}
          </p>
        </div>

        {/* ── Layer 2: Full-frame video — slides up from below ───────── */}
        <div
          ref={videoWrapRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-cream-dark)",
            padding: "clamp(16px, 2vw, 30px) clamp(16px, 2.5vw, 36px)",
            gap: "clamp(14px, 1.5vw, 22px)",
          }}
        >
          {/* Giant video frame — near-full viewport, Lusion-style */}
          <div
            style={{
              position: "relative",
              width: "calc(100vw - clamp(32px, 5vw, 72px))",
              height: "calc(100vh - clamp(100px, 12vw, 160px))",
              borderRadius: "clamp(14px, 2vw, 24px)",
              overflow: "hidden",
              boxShadow: "0 50px 120px rgba(26,24,20,0.22)",
              flexShrink: 0,
            }}
          >
            <video
              ref={videoRef}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              src="/recomendations.mp4"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
            />

            {/* Gradient overlay — top + bottom */}
            <div style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(26,24,20,0.50) 0%, transparent 35%, transparent 60%, rgba(26,24,20,0.55) 100%)",
              pointerEvents: "none",
            }} />

            {/* Section label + title — overlaid top-left */}
            <div
              dir={isRTL ? "rtl" : "ltr"}
              style={{
                position: "absolute",
                top: "clamp(1.2rem, 2.5vw, 2.2rem)",
                ...(isRTL
                  ? { right: "clamp(1.2rem, 2.5vw, 2.2rem)" }
                  : { left: "clamp(1.2rem, 2.5vw, 2.2rem)" }),
                zIndex: 2,
              }}
            >
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "rgba(245,240,232,0.65)",
                margin: "0 0 0.5rem",
              }}>
                — 03 / RESULTS
              </p>
              <div style={{
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: "clamp(1.6rem, 2.8vw, 3.2rem)",
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
                color: "var(--color-cream)",
                borderBottom: "2.5px solid var(--color-orange)",
                paddingBottom: "0.12em",
                display: "inline-block",
              }}>
                {isRTL ? "ככה נראות תוצאות" : "What Results Look Like"}
              </div>
            </div>

            {/* Mute toggle */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? (isRTL ? "הפעל קול" : "Unmute") : (isRTL ? "השתק" : "Mute")}
              style={{
                position: "absolute",
                bottom: "1.2rem",
                insetInlineEnd: "1.2rem",
                zIndex: 10,
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "50%",
                background: "rgba(26,24,20,0.50)",
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
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(26,24,20,0.50)")}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>

          {/* Calendly CTA — below the frame */}
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
                padding: "0.75rem 2rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
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
