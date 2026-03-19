import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useI18n } from "@/i18n/simple";
import { socials } from "@/content/socials";

// ── Spine path: large clockwise teardrop loop, tail exits right ────────────
// LTR: enters top, loops left side, exits right
const SPINE_LTR =
  "M 500 -60 " +
  "C 820 20, 980 240, 800 460 " +
  "C 640 680, 280 700, 110 510 " +
  "C -70 320, 40 100, 240 55 " +
  "C 410 10, 580 180, 740 450 " +
  "C 900 700, 1150 580, 1480 370";

// RTL: mirror
const SPINE_RTL =
  "M 900 -60 " +
  "C 580 20, 420 240, 600 460 " +
  "C 760 680, 1120 700, 1290 510 " +
  "C 1470 320, 1360 100, 1160 55 " +
  "C 990 10, 820 180, 660 450 " +
  "C 500 700, 250 580, -80 370";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function mapRange(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const clamped = Math.max(inMin, Math.min(inMax, val));
  return outMin + ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin);
}

const ResultsReel = () => {
  const { language } = useI18n();
  const isRTL = language === "he";
  const hasCalendly = Boolean(socials.calendlyUrl);

  const outerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // ── Direct scroll driver — matches the JS pattern from the reference ──
  useEffect(() => {
    const outer = outerRef.current;
    const path = pathRef.current;
    const videoContainer = videoContainerRef.current;
    if (!outer || !path || !videoContainer) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    // Start with a tiny bit drawn so spine is immediately visible on enter
    path.style.strokeDashoffset = String(len * 0.97);
    videoContainer.style.transform = `translateY(${window.innerHeight * 1.05}px)`;

    const update = () => {
      const rect = outer.getBoundingClientRect();
      const totalRange = outer.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalRange));

      // Spine: starts at 3% drawn, completes by 65%
      const spinePct = mapRange(progress, 0, 0.65, 0.03, 1);
      path.style.strokeDashoffset = String(len * (1 - spinePct));

      // Video rises 0.42 → 0.88
      const vidPct = easeOutCubic(mapRange(progress, 0.42, 0.88, 0, 1));
      const translateY = (1 - vidPct) * window.innerHeight * 1.05;
      videoContainer.style.transform = `translateY(${translateY}px)`;
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // ── Auto-mute when off screen ──────────────────────────────────────────
  useEffect(() => {
    const el = videoContainerRef.current;
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
    // 280vh total — matches the reference code
    <div
      ref={outerRef}
      id="results"
      style={{ height: "280vh", position: "relative", background: "var(--color-cream-dark)" }}
    >
      {/* ── Sticky container — top: 10vh as per reference ─────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* ── Layer 1: Spine SVG fills the sticky viewport ────────────── */}
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
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p style={{
            position: "relative",
            zIndex: 1,
            fontFamily: "var(--font-mono)",
            fontSize: "0.54rem",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            color: "rgba(26,24,20,0.15)",
            userSelect: "none",
          }}>
            {isRTL ? "ממשיכים לתוצאות" : "continuing to results"}
          </p>
        </div>

        {/* ── Layer 2: Video frame — translates up from below via JS ────── */}
        {/* width: 90%, centered, height: 75vh — Lusion-style large frame */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "12%",
            right: "12%",
            height: "90%",
          }}
        >
          <div
            ref={videoContainerRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: "clamp(14px, 2vw, 22px)",
              overflow: "hidden",
              boxShadow: "0 50px 120px rgba(26,24,20,0.22)",
              willChange: "transform",
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

            {/* Gradient overlay */}
            <div style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(26,24,20,0.52) 0%, transparent 38%, transparent 62%, rgba(26,24,20,0.52) 100%)",
              pointerEvents: "none",
            }} />

            {/* Label + title overlaid top corner */}
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
                fontSize: "0.6rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "rgba(245,240,232,0.60)",
                margin: "0 0 0.5rem",
              }}>
                — 03 / RESULTS
              </p>
              <div style={{
                fontFamily: isRTL ? "var(--font-display)" : "var(--font-display-en-hero)",
                fontWeight: isRTL ? 900 : 400,
                fontSize: "clamp(1.6rem, 2.8vw, 3.2rem)",
                lineHeight: 0.9,
                letterSpacing: isRTL ? "-0.02em" : "-0.01em",
                color: "var(--color-cream)",
                borderBottom: "2.5px solid var(--color-orange)",
                paddingBottom: "0.12em",
                display: "inline-block",
              }}>
                {isRTL ? "ככה נראות תוצאות" : "What Results Look Like"}
              </div>
            </div>

            {/* Calendly CTA — bottom corner */}
            {hasCalendly && (
              <button
                onClick={() => socials.calendlyUrl && window.open(socials.calendlyUrl, "_blank")}
                style={{
                  position: "absolute",
                  bottom: "clamp(1rem, 2vw, 1.8rem)",
                  ...(isRTL
                    ? { left: "clamp(1rem, 2vw, 1.8rem)" }
                    : { right: "clamp(1rem, 2vw, 1.8rem)" }),
                  zIndex: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "var(--color-orange)",
                  color: "white",
                  border: "none",
                  borderRadius: "9999px",
                  padding: "0.75rem 1.8rem",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.88rem",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {isRTL ? "קבעו שיחת היכרות קצרה" : "Book a quick call"}
              </button>
            )}

            {/* Mute toggle */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? (isRTL ? "הפעל קול" : "Unmute") : (isRTL ? "השתק" : "Mute")}
              style={{
                position: "absolute",
                bottom: "clamp(1rem, 2vw, 1.8rem)",
                ...(isRTL
                  ? { right: "clamp(1rem, 2vw, 1.8rem)" }
                  : { left: "clamp(1rem, 2vw, 1.8rem)" }),
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
        </div>
      </div>
    </div>
  );
};

export default ResultsReel;
