import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useI18n } from "@/i18n/simple";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

// ── Circle dot positions (% of circle container, center = 50,50) ──────────
// Angles in degrees, 5 steps × 72°, starting from top (-90°)
const ANGLES = [-90, -18, 54, 126, 198];

function ptPct(radiusPct: number, deg: number) {
  const a = (deg * Math.PI) / 180;
  return {
    x: 50 + radiusPct * Math.cos(a),
    y: 50 + radiusPct * Math.sin(a),
  };
}

type Anchor = { tx: string; ty: string; align: "left" | "right" | "center" };
// Text-anchor offsets tuned per clock position
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

const ProcessTimeline = () => {
  const { language } = useI18n();
  const isRTL = language === "he";
  const steps = isRTL ? STEPS_HE : STEPS_EN;

  const stickyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stickyRef as React.RefObject<Element>, { once: true, margin: "0px" });

  // Dot on the ring at 50% radius of the container
  const DOT_R = 50;
  // Label anchor points: just outside the ring
  const LABEL_R = 64;

  return (
    // ── Outer: 215vh total, correct Boathouse ratio ─────────────────────
    <div
      id="process"
      style={{ height: "215vh", position: "relative", background: "var(--color-cream-dark)" }}
    >
      {/* ── BLOCK 1: intro — normal flow, scrolls away naturally ────────── */}
      {/* Its height physically pushes the sticky block below the fold */}
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

      {/* ── BLOCK 2: sticky circle — locks at top:0 after Block 1 exits ── */}
      <div
        ref={stickyRef}
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "visible",
        }}
      >
        {/* ── Two-column: list LEFT + circle RIGHT ─────────────────────── */}
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
          {/* ── LEFT: numbered step list ────────────────────────────────── */}
          <div
            style={{
              flexShrink: 0,
              width: "clamp(200px, 32%, 380px)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(1.2rem, 2.2vh, 2.2rem)",
            }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: EASE }}
                style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
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
              </motion.div>
            ))}
          </div>

          {/* ── RIGHT: radial circle diagram ────────────────────────────── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Wrapper — labels can overflow this */}
            <div
              style={{
                position: "relative",
                width: "min(62vh, 52vw)",
                height: "min(62vh, 52vw)",
              }}
            >
              {/* CSS ring */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1.4, ease: EASE }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "1.5px solid rgba(26,24,20,0.13)",
                }}
              />

              {/* Dots + connector lines */}
              {ANGLES.map((angle, i) => {
                const dot = ptPct(DOT_R, angle);
                const lineEnd = ptPct(DOT_R + 8, angle);
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 + i * 0.12, ease: EASE }}
                    style={{ position: "absolute", inset: 0 }}
                  >
                    {/* SVG connector line (tiny per-dot) */}
                    <svg
                      viewBox="0 0 100 100"
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
                    >
                      <line
                        x1={dot.x} y1={dot.y}
                        x2={lineEnd.x} y2={lineEnd.y}
                        stroke="rgba(26,24,20,0.10)"
                        strokeWidth="0.4"
                      />
                    </svg>
                    {/* Dot */}
                    <div style={{
                      position: "absolute",
                      left: `${dot.x}%`,
                      top: `${dot.y}%`,
                      transform: "translate(-50%, -50%)",
                      width: i === 0 ? "10px" : "7px",
                      height: i === 0 ? "10px" : "7px",
                      borderRadius: "50%",
                      background: i === 0 ? "var(--color-orange)" : "rgba(26,24,20,0.22)",
                    }} />
                  </motion.div>
                );
              })}

              {/* Center text */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
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
              </motion.div>

              {/* Step labels — outside the ring */}
              {steps.map((step, i) => {
                const lPos = ptPct(LABEL_R, ANGLES[i]);
                const cfg = ANCHORS[i];
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, y: 8 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.45, delay: 1.1 + i * 0.12, ease: EASE }}
                    dir={isRTL ? "rtl" : "ltr"}
                    style={{
                      position: "absolute",
                      left: `${lPos.x}%`,
                      top: `${lPos.y}%`,
                      transform: `translate(${cfg.tx}, ${cfg.ty})`,
                      textAlign: cfg.align,
                      width: "140px",
                      pointerEvents: "none",
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
                      marginBottom: "2px",
                    }}>
                      {step.title}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 2.0, ease: EASE }}
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
