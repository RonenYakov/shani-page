import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useI18n } from "@/i18n/simple";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

// ── Geometry: 1000×1000 SVG viewBox, large circle ─────────────────────────
const VB = 1000, CX = 500, CY = 500, CR = 285, LR = 405;
const ANGLES = [-90, -18, 54, 126, 198]; // 72° apart

function pt(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

type Anchor = { tx: string; ty: string; align: "left" | "right" | "center" };
// Manually tuned per clock-position so labels sit cleanly outside the ring
const ANCHORS: Anchor[] = [
  { tx: "-50%", ty: "-118%", align: "center" }, // 12 o'clock — top
  { tx:   "10%", ty:  "-50%", align: "left"  }, // ~2 o'clock — upper-right
  { tx:   "10%", ty:  "-88%", align: "left"  }, // ~5 o'clock — lower-right
  { tx: "-110%", ty:  "-88%", align: "right" }, // ~7 o'clock — lower-left
  { tx: "-110%", ty:  "-50%", align: "right" }, // ~10 o'clock — upper-left
];

const STEPS_EN = [
  { num: "01", title: "Discovery",        desc: "Intro call — brand, audience, goals" },
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

const ProcessTimeline = () => {
  const { language } = useI18n();
  const isRTL = language === "he";
  const steps = isRTL ? STEPS_HE : STEPS_EN;

  // Trigger on the outer container — fires as soon as the section enters view
  const outerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(outerRef as React.RefObject<Element>, {
    once: true,
    margin: "0px",
  });

  return (
    <div
      ref={outerRef}
      id="process"
      style={{
        height: "250vh",
        position: "relative",
        background: "var(--color-cream-dark)",
      }}
    >
      {/* ── STICKY CIRCLE — always at z:1, behind the title overlay ──── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        {/* ── Mobile fallback: vertical list ────────────────────────── */}
        <div
          className="md:hidden"
          dir={isRTL ? "rtl" : "ltr"}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.8rem",
            padding: "0 var(--base-padding-x)",
            width: "100%",
          }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
            >
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: i === 0 ? "var(--color-orange)" : "rgba(26,24,20,0.4)",
                flexShrink: 0,
                paddingTop: "2px",
              }}>
                {step.num}
              </span>
              <div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "var(--color-ink)",
                  marginBottom: "3px",
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.55,
                }}>
                  {step.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Desktop: radial circle diagram ────────────────────────── */}
        <div
          className="hidden md:block"
          style={{
            position: "relative",
            width: "min(78vh, 80vw)",
            height: "min(78vh, 80vw)",
          }}
        >
          <svg
            viewBox={`0 0 ${VB} ${VB}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
            }}
          >
            {/* Ring */}
            <motion.circle
              cx={CX} cy={CY} r={CR}
              fill="none"
              stroke="rgba(26,24,20,0.12)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : {}}
              transition={{ duration: 2.0, ease: EASE }}
            />

            {/* Connector lines + dots */}
            {ANGLES.map((angle, i) => {
              const dot = pt(CR, angle);
              const end = pt(CR + 65, angle);
              return (
                <g key={i}>
                  <motion.line
                    x1={dot.x} y1={dot.y} x2={end.x} y2={end.y}
                    stroke="rgba(26,24,20,0.09)"
                    strokeWidth="1.2"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.4, delay: 1.1 + i * 0.14, ease: EASE }}
                  />
                  <motion.circle
                    cx={dot.x} cy={dot.y}
                    r={i === 0 ? 7 : 5}
                    fill={i === 0 ? "var(--color-orange)" : "rgba(26,24,20,0.20)"}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ duration: 0.35, delay: 1.0 + i * 0.14, ease: EASE }}
                    style={{ transformOrigin: `${dot.x}px ${dot.y}px` }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              pointerEvents: "none",
            }}
          >
            <div style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: "clamp(1rem, 2vw, 1.85rem)",
              letterSpacing: "-0.02em",
              color: "var(--color-ink)",
              lineHeight: 1.1,
            }}>
              {isRTL ? "התהליך" : "THE PROCESS"}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.4rem, 0.6vw, 0.55rem)",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "var(--color-ink-muted)",
              marginTop: "0.45rem",
            }}>
              {isRTL ? "5 שלבים" : "5 steps"}
            </div>
          </motion.div>

          {/* Step labels — absolute, mapped from SVG % coords */}
          {steps.map((step, i) => {
            const dot = pt(LR, ANGLES[i]);
            const cfg = ANCHORS[i];
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.4 + i * 0.14, ease: EASE }}
                dir={isRTL ? "rtl" : "ltr"}
                style={{
                  position: "absolute",
                  left: `${(dot.x / VB) * 100}%`,
                  top: `${(dot.y / VB) * 100}%`,
                  transform: `translate(${cfg.tx}, ${cfg.ty})`,
                  textAlign: cfg.align,
                  width: "160px",
                  pointerEvents: "none",
                }}
              >
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: i === 0 ? "var(--color-orange)" : "rgba(26,24,20,0.35)",
                  marginBottom: "3px",
                }}>
                  {step.num}
                </div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "clamp(0.68rem, 1vw, 0.86rem)",
                  color: "var(--color-ink)",
                  lineHeight: 1.2,
                  marginBottom: "3px",
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.54rem, 0.78vw, 0.68rem)",
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.5,
                }}>
                  {step.desc}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.4, ease: EASE }}
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--color-ink-muted)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "var(--color-orange)" }}>◆</span>{" "}
          {isRTL ? "מוכנים להתחיל? השלב הראשון תמיד חינם" : "Ready to start? First step is always free"}
        </motion.p>
      </div>

      {/* ── TITLE OVERLAY — absolute, z:2, slides away revealing the circle ── */}
      {/* This sits ON TOP of the sticky circle and scrolls with the page */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100vh",
          zIndex: 2,
          background: "var(--color-cream-dark)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 var(--base-padding-x) 8vh",
          pointerEvents: "none",
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
    </div>
  );
};

export default ProcessTimeline;
