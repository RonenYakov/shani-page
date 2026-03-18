import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useI18n } from "@/i18n/simple";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

// ── SVG circle geometry (viewBox 800×800, center 400,400) ─────────────────
const CX = 400, CY = 400, CR = 235, LABEL_R = 320;
const ANGLES = [-90, -18, 54, 126, 198]; // 72° apart, start top

function pt(r: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

// Per-step label anchor — manually tuned for each clock position
const ANCHORS = [
  { tx: "-50%", ty: "-115%", align: "center" as const },  // top
  { tx: "8%",   ty: "-50%",  align: "left"   as const },  // upper-right
  { tx: "5%",   ty: "-85%",  align: "left"   as const },  // lower-right
  { tx: "-105%",ty: "-85%",  align: "right"  as const },  // lower-left
  { tx: "-108%",ty: "-50%",  align: "right"  as const },  // upper-left
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

  const stickyRef = useRef<HTMLDivElement>(null);
  const circleInView = useInView(stickyRef as React.RefObject<Element>, {
    once: true,
    margin: "-80px",
  });

  return (
    // Outer container — taller than viewport creates the "dwell" while sticky is pinned
    <div
      id="process"
      style={{ height: "300vh", position: "relative", background: "var(--color-cream-dark)" }}
    >
      {/* ── Entry block: label + title scrolls away naturally ─────────────── */}
      <div
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          height: "52vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 var(--base-padding-x) 5vh",
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

      {/* ── Sticky circle — locks at top:0 for the dwell ──────────────────── */}
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "visible",
        }}
      >
        {/* Circle container */}
        <div
          style={{
            position: "relative",
            width: "min(70vh, 80vw)",
            height: "min(70vh, 80vw)",
          }}
        >
          {/* SVG: ring + dots + connector lines */}
          <svg
            viewBox="0 0 800 800"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
            }}
          >
            <motion.circle
              cx={CX} cy={CY} r={CR}
              fill="none"
              stroke="rgba(26,24,20,0.13)"
              strokeWidth="1.5"
              initial={{ pathLength: 0 }}
              animate={circleInView ? { pathLength: 1 } : {}}
              transition={{ duration: 1.8, ease: EASE }}
            />

            {ANGLES.map((angle, i) => {
              const dot = pt(CR, angle);
              const lineEnd = pt(CR + 52, angle);
              return (
                <g key={i}>
                  <motion.line
                    x1={dot.x} y1={dot.y} x2={lineEnd.x} y2={lineEnd.y}
                    stroke="rgba(26,24,20,0.10)"
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={circleInView ? { pathLength: 1 } : {}}
                    transition={{ duration: 0.4, delay: 1.0 + i * 0.12, ease: EASE }}
                  />
                  <motion.circle
                    cx={dot.x} cy={dot.y}
                    r={i === 0 ? 6 : 4.5}
                    fill={i === 0 ? "var(--color-orange)" : "rgba(26,24,20,0.22)"}
                    initial={{ scale: 0 }}
                    animate={circleInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.35, delay: 0.9 + i * 0.12, ease: EASE }}
                    style={{ transformOrigin: `${dot.x}px ${dot.y}px` }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center text */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={circleInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
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
              fontSize: "clamp(1.1rem, 2.2vw, 2rem)",
              letterSpacing: "-0.02em",
              color: "var(--color-ink)",
              lineHeight: 1.1,
            }}>
              {isRTL ? "התהליך" : "THE PROCESS"}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(0.45rem, 0.65vw, 0.58rem)",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "var(--color-ink-muted)",
              marginTop: "0.45rem",
            }}>
              {isRTL ? "5 שלבים" : "5 steps"}
            </div>
          </motion.div>

          {/* Step labels — positioned by mapping SVG coords → percentages */}
          {steps.map((step, i) => {
            const labelDot = pt(LABEL_R, ANGLES[i]);
            const cfg = ANCHORS[i];
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 10 }}
                animate={circleInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.3 + i * 0.12, ease: EASE }}
                dir={isRTL ? "rtl" : "ltr"}
                style={{
                  position: "absolute",
                  left: `${(labelDot.x / 800) * 100}%`,
                  top: `${(labelDot.y / 800) * 100}%`,
                  transform: `translate(${cfg.tx}, ${cfg.ty})`,
                  textAlign: cfg.align,
                  width: "150px",
                }}
              >
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: i === 0 ? "var(--color-orange)" : "rgba(26,24,20,0.38)",
                  marginBottom: "3px",
                }}>
                  {step.num}
                </div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "clamp(0.7rem, 1.05vw, 0.88rem)",
                  color: "var(--color-ink)",
                  lineHeight: 1.2,
                  marginBottom: "3px",
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.56rem, 0.82vw, 0.7rem)",
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
          animate={circleInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.1, ease: EASE }}
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
    </div>
  );
};

export default ProcessTimeline;
