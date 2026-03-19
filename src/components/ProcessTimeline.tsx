import { useRef, useEffect, useState } from "react";
import { useI18n } from "@/i18n/simple";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1]; void EASE;

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const outerRef      = useRef<HTMLDivElement>(null);
  const ringRef       = useRef<HTMLDivElement>(null);
  const centerRef     = useRef<HTMLDivElement>(null);
  const noteRef       = useRef<HTMLParagraphElement>(null);
  const listRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const labelWrappers = useRef<(HTMLDivElement | null)[]>([]);

  // ── Scroll-driven sequential reveal ───────────────────────────────────
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const update = () => {
      const rect    = outer.getBoundingClientRect();
      const total   = outer.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const dwell   = Math.min(1, scrolled / total);

      // Ring + center fade in quickly
      if (ringRef.current)   ringRef.current.style.opacity   = String(Math.min(1, dwell * 8));
      if (centerRef.current) centerRef.current.style.opacity = String(Math.min(1, dwell * 6));

      // Which step is currently active (0-based)
      const activeStep = Math.min(N - 1, Math.floor((dwell / 0.85) * N));

      for (let i = 0; i < N; i++) {
        const start = (i / N) * 0.80;
        const frac  = Math.max(0, Math.min(1, (dwell - start) / 0.14));
        const isActive = i === activeStep;

        // List item
        const listEl = listRefs.current[i];
        if (listEl) {
          listEl.style.opacity   = String(frac);
          const xOff = (isRTL ? 18 : -18) * (1 - frac);
          listEl.style.transform = `translateX(${xOff}px)`;
          // Highlight active step number
          const numSpan = listEl.querySelector("span") as HTMLSpanElement | null;
          if (numSpan) {
            numSpan.style.color = isActive ? "var(--color-orange)" : "rgba(26,24,20,0.38)";
          }
        }

        // Circle dot — orange follows active step
        const dotEl = dotRefs.current[i];
        if (dotEl) {
          dotEl.style.opacity    = String(frac);
          dotEl.style.transform  = `translate(-50%, -50%) scale(${0.3 + 0.7 * frac})`;
          dotEl.style.background = isActive ? "var(--color-orange)" : "rgba(26,24,20,0.22)";
          dotEl.style.width      = isActive ? "12px" : "7px";
          dotEl.style.height     = isActive ? "12px" : "7px";
          dotEl.style.transition = "background 0.4s ease, width 0.4s ease, height 0.4s ease, opacity 0.3s ease, transform 0.3s ease";
        }

        // Label
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
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [isRTL]);

  // ── Mobile: simple vertical numbered list, no animation, no sticky ────────
  if (isMobile) {
    return (
      <section
        id="process"
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          background: "var(--color-cream)",
          padding: "clamp(3rem, 8vw, 5rem) var(--base-padding-x)",
        }}
      >
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--color-orange)",
          marginBottom: "0.6rem",
        }}>— 02 / PROCESS</p>
        <h2 style={{
          fontFamily: isRTL ? "var(--font-display)" : "var(--font-display-en-hero)",
          fontWeight: isRTL ? 900 : 400,
          fontSize: "clamp(2.4rem, 9vw, 3.5rem)",
          lineHeight: 0.9,
          color: "var(--color-ink)",
          margin: "0 0 2.5rem",
          borderBottom: "3px solid var(--color-orange)",
          paddingBottom: "0.15em",
          display: "inline-block",
        }}>
          {isRTL ? "איך אני עובדת" : "How I Work"}
        </h2>

        <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0" }}>
          {steps.map((step, i) => (
            <li
              key={step.num}
              style={{
                display: "flex",
                gap: "1.2rem",
                alignItems: "flex-start",
                borderTop: "1px solid rgba(26,24,20,0.1)",
                padding: "1.4rem 0",
              }}
            >
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                letterSpacing: "0.12em",
                color: i === 0 ? "var(--color-orange)" : "rgba(26,24,20,0.38)",
                paddingTop: "4px",
                flexShrink: 0,
                minWidth: "2.2rem",
              }}>
                {step.num}
              </span>
              <div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  color: "var(--color-ink)",
                  marginBottom: "0.3rem",
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.88rem",
                  color: "var(--color-ink-muted)",
                  lineHeight: 1.6,
                }}>
                  {step.desc}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    // 250vh: title stays sticky, dwell time for 5 steps
    <div
      ref={outerRef}
      id="process"
      style={{ height: "250vh", position: "relative", background: "var(--color-cream)" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          overflow: "visible",
          background: "var(--color-cream)",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,24,20,0.04) 0%, transparent 70%), repeating-linear-gradient(88deg, var(--color-line) 0px, var(--color-line) 1px, transparent 1px, transparent 80px)",
        }}
      >
        {/* ── Title — always visible at the top ────────────────────────────── */}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          style={{
            position: "absolute",
            top: "2.5rem",
            ...(isRTL
              ? { right: "var(--base-padding-x)" }
              : { left: "var(--base-padding-x)" }),
          }}
        >
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--color-orange)",
            marginBottom: "0.5rem",
          }}>
            — 02 / PROCESS
          </p>
          <h2 style={{
            fontFamily: isRTL ? "var(--font-display)" : "var(--font-display-en-hero)",
            fontWeight: isRTL ? 900 : 400,
            fontSize: "clamp(2.2rem, 4.5vw, 4.5rem)",
            lineHeight: 0.88,
            letterSpacing: isRTL ? "-0.02em" : "-0.01em",
            color: "var(--color-ink)",
            margin: 0,
            borderBottom: "3px solid var(--color-orange)",
            paddingBottom: "0.15em",
            display: "inline-block",
          }}>
            {isRTL ? "איך אני עובדת" : "How I Work"}
          </h2>
        </div>

        {/* ── Two-column body: list + circle ───────────────────────────────── */}
        <div
          dir={isRTL ? "rtl" : "ltr"}
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding: "0 var(--base-padding-x)",
            gap: "clamp(2rem, 4vw, 6rem)",
            paddingTop: "7rem", // leave room for sticky title
          }}
        >
          {/* ── Left: numbered step list ──────────────────────────────────── */}
          <div style={{
            flexShrink: 0,
            width: "clamp(200px, 32%, 380px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(1.1rem, 2vh, 2rem)",
          }}>
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
                  transition: "color 0.4s ease",
                }}>
                  {step.num}
                </span>
                <div>
                  <div style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: "clamp(1rem, 1.6vw, 1.3rem)",
                    color: "var(--color-ink)",
                    marginBottom: "4px",
                    lineHeight: 1.2,
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)",
                    color: "var(--color-ink-muted)",
                    lineHeight: 1.55,
                  }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Right: CSS circle diagram ──────────────────────────────────── */}
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

              {/* Dots — one per step, orange follows active */}
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
                      width: i === 0 ? "12px" : "7px",
                      height: i === 0 ? "12px" : "7px",
                      borderRadius: "50%",
                      background: i === 0 ? "var(--color-orange)" : "rgba(26,24,20,0.22)",
                      opacity: 0,
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
                  fontSize: "clamp(1.1rem, 2.2vw, 2.2rem)",
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
                        fontSize: "clamp(0.78rem, 1.1vw, 0.95rem)",
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
