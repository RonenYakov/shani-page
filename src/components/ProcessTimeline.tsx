import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/simple";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

const ANGLES = [-90, -18, 54, 126, 198]; // 72° apart, clockwise from top

function ptPct(radiusPct: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: 50 + radiusPct * Math.cos(a), y: 50 + radiusPct * Math.sin(a) };
}

type Anchor = { tx: string; ty: string; align: "left" | "right" | "center" };
const ANCHORS: Anchor[] = [
  { tx: "-50%", ty: "-130%", align: "center" }, // 12 o'clock
  { tx:  "12%", ty:  "-50%", align: "left"   }, // ~2 o'clock
  { tx:  "12%", ty:  "-90%", align: "left"   }, // ~5 o'clock
  { tx: "-112%",ty:  "-90%", align: "right"  }, // ~7 o'clock
  { tx: "-112%",ty:  "-50%", align: "right"  }, // ~10 o'clock
];

const STEPS_EN = [
  { num: "01", title: "Discovery",        desc: "Intro call — brand, audience & goals" },
  { num: "02", title: "Concepts",         desc: "Strategy & content calendar" },
  { num: "03", title: "Production",       desc: "Filming, editing, design" },
  { num: "04", title: "Publishing",       desc: "Ongoing management & replies" },
  { num: "05", title: "Report & Iterate", desc: "Data-driven monthly improvements" },
];
const STEPS_HE = [
  { num: "01", title: "היכרות",      desc: "שיחת גילוי — מותג, קהל ומטרות" },
  { num: "02", title: "קונספטים",    desc: "אסטרטגיה ולוח תוכן" },
  { num: "03", title: "הפקה",        desc: "צילום, עריכה ועיצוב" },
  { num: "04", title: "פרסום",       desc: "ניהול שוטף ותגובות" },
  { num: "05", title: "דיווח ושיפור",desc: "נתונים שמובילים להחלטות" },
];

const N = 5;

const ProcessTimeline = () => {
  const { language } = useI18n();
  const isRTL = language === "he";
  const steps = isRTL ? STEPS_HE : STEPS_EN;

  const outerRef     = useRef<HTMLDivElement>(null);
  const ringRef      = useRef<HTMLDivElement>(null);
  const centerRef    = useRef<HTMLDivElement>(null);
  const noteRef      = useRef<HTMLParagraphElement>(null);
  const listRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const labelWrappers= useRef<(HTMLDivElement | null)[]>([]);

  // ── Scroll-driven sequential reveal ───────────────────────────────────
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const INTRO_FRAC = 0.58; // intro block is 58vh

    const update = () => {
      const rect   = outer.getBoundingClientRect();
      const total  = outer.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const sectionProgress = Math.min(1, scrolled / total);

      // stickyStart in section progress units
      const stickyStartPx = INTRO_FRAC * window.innerHeight;
      const dwellPx = total - stickyStartPx;
      // dwell progress: 0 when sticky first locks → 1 when section ends
      const dwell = Math.max(0, Math.min(1, (scrolled - stickyStartPx) / dwellPx));

      // Ring + center fade in immediately at start of dwell
      const ringFade = Math.min(1, dwell * 10);
      if (ringRef.current)   ringRef.current.style.opacity   = String(ringFade);
      if (centerRef.current) centerRef.current.style.opacity = String(Math.min(1, dwell * 7));

      // Each step staggered across 0..0.85 of dwell
      for (let i = 0; i < N; i++) {
        const start = (i / N) * 0.80;
        const frac  = Math.max(0, Math.min(1, (dwell - start) / 0.14));

        // List item
        const listEl = listRefs.current[i];
        if (listEl) {
          listEl.style.opacity   = String(frac);
          const xOff = (isRTL ? 18 : -18) * (1 - frac);
          listEl.style.transform = `translateX(${xOff}px)`;
        }

        // Circle dot
        const dotEl = dotRefs.current[i];
        if (dotEl) {
          dotEl.style.opacity   = String(frac);
          dotEl.style.transform = `translate(-50%, -50%) scale(${0.3 + 0.7 * frac})`;
        }

        // Label — combine base anchor + animated Y
        const labelEl = labelWrappers.current[i];
        if (labelEl) {
          const yOff = 10 * (1 - frac);
          labelEl.style.opacity   = String(frac);
          labelEl.style.transform = `translate(${ANCHORS[i].tx}, ${ANCHORS[i].ty}) translateY(${yOff}px)`;
        }
      }

      // Bottom note appears after all steps
      if (noteRef.current) {
        noteRef.current.style.opacity = String(Math.max(0, Math.min(1, (dwell - 0.88) / 0.08)));
      }

      // Unused to avoid lint: sectionProgress
      void sectionProgress;
    };

    window.addEventListener("scroll", update, { passive: true });
    update(); // run once on mount
    return () => window.removeEventListener("scroll", update);
  }, [isRTL]);

  return (
    // 300vh: 58vh entry + 100vh sticky + 142vh dwell = 5 steps spread across 142vh
    <div
      ref={outerRef}
      id="process"
      style={{ height: "300vh", position: "relative", background: "var(--color-cream-dark)" }}
    >
      {/* ── Block 1: title — normal flow, scrolls away ───────────────────── */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          position: "relative",
          height: "58vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 var(--base-padding-x) 6vh",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
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
          — 02 / PROCESS
        </motion.p>
        <div style={{ overflow: "hidden" }}>
          <motion.h2
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
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
            {isRTL ? "איך אני עובדת" : "How I Work"}
          </motion.h2>
        </div>
      </div>

      {/* ── Block 2: sticky — two-column, scroll-animated ────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "visible",
        }}
      >
        <div
          dir={isRTL ? "rtl" : "ltr"}
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "0 var(--base-padding-x)",
            gap: "clamp(2rem, 4vw, 6rem)",
          }}
        >
          {/* ── Left: numbered step list ──────────────────────────────── */}
          <div
            style={{
              flexShrink: 0,
              width: "clamp(200px, 32%, 380px)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(1.1rem, 2vh, 2rem)",
            }}
          >
            {steps.map((step, i) => (
              <div
                key={step.num}
                ref={el => { listRefs.current[i] = el; }}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  opacity: 0,
                  transition: "opacity 0.35s ease, transform 0.35s ease",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.58rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: i === 0 ? "var(--color-orange)" : "rgba(26,24,20,0.38)",
                  flexShrink: 0,
                  paddingTop: "3px",
                }}>
                  {step.num}
                </span>
                <div>
                  <div style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: "clamp(0.85rem, 1.3vw, 1.05rem)",
                    color: "var(--color-ink)",
                    marginBottom: "3px",
                    lineHeight: 1.2,
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(0.72rem, 0.95vw, 0.82rem)",
                    color: "var(--color-ink-muted)",
                    lineHeight: 1.55,
                  }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Right: CSS circle diagram ──────────────────────────────── */}
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}>
            <div style={{
              position: "relative",
              width: "min(60vh, 50vw)",
              height: "min(60vh, 50vw)",
            }}>
              {/* CSS ring */}
              <div
                ref={ringRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(26,24,20,0.13)",
                  opacity: 0,
                  transition: "opacity 0.5s ease",
                }}
              />

              {/* Dots — one per step, scroll-revealed */}
              {ANGLES.map((angle, i) => {
                const dot = ptPct(50, angle);
                return (
                  <div
                    key={i}
                    ref={el => { dotRefs.current[i] = el; }}
                    style={{
                      position: "absolute",
                      left: `${dot.x}%`,
                      top: `${dot.y}%`,
                      transform: "translate(-50%, -50%) scale(0.3)",
                      width: i === 0 ? "10px" : "7px",
                      height: i === 0 ? "10px" : "7px",
                      borderRadius: "50%",
                      background: i === 0 ? "var(--color-orange)" : "rgba(26,24,20,0.22)",
                      opacity: 0,
                      transition: "opacity 0.3s ease, transform 0.3s ease",
                    }}
                  />
                );
              })}

              {/* Center text */}
              <div
                ref={centerRef}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  pointerEvents: "none",
                  opacity: 0,
                  transition: "opacity 0.5s ease",
                }}
              >
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 400,
                  fontSize: "clamp(0.9rem, 1.8vw, 1.7rem)",
                  letterSpacing: "-0.02em",
                  color: "var(--color-ink)",
                  lineHeight: 1.1,
                }}>
                  {isRTL ? "התהליך" : "THE PROCESS"}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(0.38rem, 0.55vw, 0.52rem)",
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "var(--color-ink-muted)",
                  marginTop: "0.4rem",
                }}>
                  {isRTL ? "5 שלבים" : "5 steps"}
                </div>
              </div>

              {/* Labels — positioned, scroll-revealed */}
              {steps.map((step, i) => {
                const lPos = ptPct(64, ANGLES[i]);
                const cfg = ANCHORS[i];
                return (
                  // outer div: sets left/top (no transform)
                  <div
                    key={step.num}
                    style={{
                      position: "absolute",
                      left: `${lPos.x}%`,
                      top: `${lPos.y}%`,
                      width: "140px",
                      pointerEvents: "none",
                    }}
                  >
                    {/* inner div: anchor transform + scroll Y offset */}
                    <div
                      ref={el => { labelWrappers.current[i] = el; }}
                      dir={isRTL ? "rtl" : "ltr"}
                      style={{
                        transform: `translate(${cfg.tx}, ${cfg.ty}) translateY(10px)`,
                        textAlign: cfg.align,
                        opacity: 0,
                        transition: "opacity 0.35s ease, transform 0.35s ease",
                      }}
                    >
                      <div style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.47rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.14em",
                        color: i === 0 ? "var(--color-orange)" : "rgba(26,24,20,0.33)",
                        marginBottom: "2px",
                      }}>
                        {step.num}
                      </div>
                      <div style={{
                        fontFamily: "var(--font-body)",
                        fontWeight: 500,
                        fontSize: "clamp(0.65rem, 0.95vw, 0.82rem)",
                        color: "var(--color-ink)",
                        lineHeight: 1.2,
                      }}>
                        {step.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p
          ref={noteRef}
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--color-ink-muted)",
            whiteSpace: "nowrap",
            opacity: 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <span style={{ color: "var(--color-orange)" }}>◆</span>{" "}
          {isRTL ? "מוכנים להתחיל? השלב הראשון תמיד חינם" : "Ready to start? First step is always free"}
        </p>
      </div>
    </div>
  );
};

export default ProcessTimeline;
