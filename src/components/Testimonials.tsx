import { useRef, useEffect } from "react";
import { useI18n } from "@/i18n/simple";
import testimonialsData from "@/content/testimonials.json";

type Testimonial = {
  id: string;
  name: { he: string; en: string };
  role: { he: string; en: string };
  content: { he: string; en: string };
  rating: number;
  image: string;
};

// Eagerly import all screenshot images from the recommendations folder
const recommendationImages = Object.values(
  import.meta.glob("@/assets/recomendations/*.{png,jpg,jpeg,webp}", {
    eager: true,
    as: "url",
  })
) as string[];

// ── Spine paths ────────────────────────────────────────────────────────────
// LTR: enters top-right at (1480, 370) — EXACT exit point of ResultsReel LTR spine
// sweeps left-down through the section, exits bottom
const SPINE_LTR =
  "M 1480 370 " +
  "C 1200 480, 900 300, 700 500 " +
  "C 500 700, 200 620, 60 780 " +
  "C -80 940, 200 1060, 500 1000 " +
  "C 800 940, 1200 800, 1480 950";

// RTL: enters top-left at (-80, 370) — mirrors ResultsReel RTL exit
const SPINE_RTL =
  "M -80 370 " +
  "C 200 480, 500 300, 700 500 " +
  "C 900 700, 1200 620, 1340 780 " +
  "C 1480 940, 1200 1060, 900 1000 " +
  "C 600 940, 200 800, -80 950";

// Rotation angles for each card — subtle organic tilt
const CARD_TILTS = [-1.5, 1.2, -0.8, 1.8, -1.1, 0.7, -1.4, 1.0, -0.6];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

const Testimonials = () => {
  const { language } = useI18n();
  const isRTL = language === "he";
  const showEnglishTestimonials = language === "en";

  const outerRef   = useRef<HTMLDivElement>(null);
  const pathRef    = useRef<SVGPathElement>(null);
  const cardsRef   = useRef<(HTMLDivElement | null)[]>([]);

  // ── Scroll-driven spine draw (same pattern as ResultsReel) ────────────
  useEffect(() => {
    const outer = outerRef.current;
    const path  = pathRef.current;
    if (!outer || !path) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray  = String(len);
    path.style.strokeDashoffset = String(len);

    const update = () => {
      const rect     = outer.getBoundingClientRect();
      const total    = outer.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.max(0, Math.min(1, scrolled / total));

      // Spine draws slowly across 0 → 0.65 (same ratio as ResultsReel)
      const spinePct = Math.max(0, Math.min(1, progress / 0.65));
      path.style.strokeDashoffset = String(len * (1 - spinePct));

      // Cards slide up from 0.35 → 1.0 of scroll range, staggered
      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        const cardStart = 0.35 + i * 0.055;
        const frac = easeOutCubic(Math.max(0, Math.min(1, (progress - cardStart) / 0.12)));
        const tilt = CARD_TILTS[i % CARD_TILTS.length];
        el.style.opacity   = String(frac);
        el.style.transform = `rotate(${tilt}deg) translateY(${(1 - frac) * 50}px)`;
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [language]);

  const items = showEnglishTestimonials
    ? (testimonialsData as Testimonial[])
    : recommendationImages;

  return (
    // 320vh so spine draws slowly with enough scroll distance
    <div
      ref={outerRef}
      id="testimonials"
      style={{ height: "320vh", position: "relative", background: "var(--color-ink)" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "var(--color-ink)",
        }}
      >
        {/* ── Spine SVG ─────────────────────────────────────────────────── */}
        <svg
          viewBox="0 0 1400 1000"
          preserveAspectRatio="xMidYMid slice"
          overflow="hidden"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
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

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          style={{
            position: "absolute",
            top: "clamp(2.5rem, 5vh, 4.5rem)",
            ...(isRTL
              ? { right: "var(--base-padding-x)" }
              : { left: "var(--base-padding-x)" }),
            zIndex: 2,
          }}
        >
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--color-orange)",
            marginBottom: "0.7rem",
          }}>
            — 04 / {isRTL ? "המלצות" : "TESTIMONIALS"}
          </p>
          <h2 style={{
            fontFamily: isRTL ? "var(--font-display)" : "var(--font-display-en-hero)",
            fontWeight: isRTL ? 900 : 400,
            fontSize: "clamp(2.8rem, 7vw, 7.5rem)",
            lineHeight: 0.88,
            letterSpacing: isRTL ? "-0.02em" : "-0.01em",
            color: "var(--color-cream)",
            margin: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "0 0.25em",
          }}>
            {(isRTL ? "מה אומרים עליי" : "What People Say").split(" ").map((word, i) => (
              <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
                <span style={{
                  display: "inline-block",
                  transform: "translateY(110%)",
                  animation: `wordUp 0.8s cubic-bezier(0.35,0,0,1) ${0.1 + i * 0.12}s forwards`,
                }}>
                  {word}
                </span>
              </span>
            ))}
          </h2>
          <div style={{
            marginTop: "0.9rem",
            height: "3px",
            width: "clamp(3rem, 5vw, 5rem)",
            background: "var(--color-orange)",
            borderRadius: "9999px",
          }} />
        </div>

        {/* ── Cards grid — scrolls into view via JS ─────────────────────── */}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          style={{
            position: "absolute",
            top: "clamp(10rem, 22vh, 18rem)",
            left: "var(--base-padding-x)",
            right: "var(--base-padding-x)",
            bottom: "2rem",
            zIndex: 2,
            columns: "3",
            columnGap: "clamp(0.75rem, 1.5vw, 1.5rem)",
            overflowY: "hidden",
          }}
        >
          {showEnglishTestimonials
            ? (items as Testimonial[]).map((t, i) => (
              <div
                key={t.id}
                ref={el => { cardsRef.current[i] = el; }}
                style={{
                  breakInside: "avoid",
                  marginBottom: "clamp(0.75rem, 1.5vw, 1.5rem)",
                  background: "var(--color-off-white)",
                  borderRadius: "var(--global-border-radius)",
                  padding: "clamp(1.2rem, 2vw, 1.8rem)",
                  opacity: 0,
                  transform: `rotate(${CARD_TILTS[i % CARD_TILTS.length]}deg) translateY(50px)`,
                  transition: "none",
                  boxShadow: "0 20px 55px rgba(0,0,0,0.45)",
                }}
              >
                <p style={{
                  fontFamily: "var(--font-display-en)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(0.95rem, 1.3vw, 1.2rem)",
                  lineHeight: 1.55,
                  color: "var(--color-ink)",
                  marginBottom: "1rem",
                }}>
                  "{t.content.en}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <div style={{
                    width: "2.2rem", height: "2.2rem", borderRadius: "50%",
                    background: "var(--color-orange)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-body)", fontWeight: 600,
                    fontSize: "0.8rem", color: "white", flexShrink: 0,
                  }}>
                    {t.name.en.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-ink)" }}>
                      {t.name.en}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-ink-muted)" }}>
                      {t.role.en}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "3px", marginTop: "0.8rem" }}>
                  {[...Array(t.rating)].map((_, si) => (
                    <svg key={si} width="13" height="13" viewBox="0 0 20 20" fill="var(--color-orange)">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))
            : (items as string[]).map((src, i) => (
              <div
                key={src}
                ref={el => { cardsRef.current[i] = el; }}
                style={{
                  breakInside: "avoid",
                  marginBottom: "clamp(0.75rem, 1.5vw, 1.5rem)",
                  background: "var(--color-off-white)",
                  borderRadius: "var(--global-border-radius)",
                  padding: "clamp(0.6rem, 1vw, 0.9rem)",
                  opacity: 0,
                  transform: `rotate(${CARD_TILTS[i % CARD_TILTS.length]}deg) translateY(50px)`,
                  transition: "none",
                  boxShadow: "0 20px 55px rgba(0,0,0,0.45)",
                }}
              >
                <img
                  src={src}
                  alt="המלצת לקוח"
                  loading="lazy"
                  style={{
                    width: "100%", height: "auto",
                    borderRadius: "calc(var(--global-border-radius) - 4px)",
                    display: "block",
                  }}
                />
              </div>
            ))
          }
        </div>

        {/* ── Bottom note ───────────────────────────────────────────────── */}
        <p style={{
          position: "absolute",
          bottom: "1.8rem",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-mono)",
          fontSize: "0.58rem",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "rgba(245,240,232,0.35)",
          whiteSpace: "nowrap",
          zIndex: 2,
        }}>
          <span style={{ color: "var(--color-orange)" }}>◆</span>{" "}
          {isRTL ? "רוצים להצטרף לרשימת הלקוחות המרוצים?" : "Want to join the list of satisfied clients?"}
        </p>
      </div>
    </div>
  );
};

export default Testimonials;
