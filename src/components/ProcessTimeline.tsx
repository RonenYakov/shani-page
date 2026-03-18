import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useI18n } from "@/i18n/simple";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

const ProcessTimeline = () => {
  const { language } = useI18n();
  const isRTL = language === "he";
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const steps = language === "he"
    ? [
        { num: "01", title: "היכרות", desc: "שיחת גילוי — מבינים את המותג, הקהל והמטרות" },
        { num: "02", title: "קונספטים", desc: "אסטרטגיה ולוח תוכן — כל רעיון בנוי על הנתונים" },
        { num: "03", title: "הפקה", desc: "צילום, עריכה ועיצוב — תוכן שנראה טוב ועובד" },
        { num: "04", title: "פרסום", desc: "ניהול שוטף — פרסום, תגובות ואופטימיזציה" },
        { num: "05", title: "דיווח ושיפור", desc: "נתונים שמובילים להחלטות — כל חודש מדויק יותר" },
      ]
    : [
        { num: "01", title: "Discovery", desc: "Intro call — understanding brand, audience, and goals" },
        { num: "02", title: "Concepts", desc: "Strategy and content calendar — every idea built on data" },
        { num: "03", title: "Production", desc: "Filming, editing, design — content that looks good and works" },
        { num: "04", title: "Publishing", desc: "Ongoing management — publishing, replies, optimisation" },
        { num: "05", title: "Report & Iterate", desc: "Data that drives decisions — every month more precise" },
      ];

  return (
    <section
      ref={sectionRef}
      id="process"
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background: "var(--color-cream-dark)",
        padding: "clamp(70px, 9vw, 120px) var(--base-padding-x)",
        position: "relative",
        overflow: "hidden",
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
        — 02 / PROCESS
      </motion.p>

      {/* Title row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "clamp(48px, 6vw, 80px)",
          gap: "2rem",
        }}
      >
        <div style={{ overflow: "hidden" }}>
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
            {isRTL ? "איך אני עובדת" : "How I Work"}
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--color-ink-muted)",
            maxWidth: "26ch",
            lineHeight: 1.65,
            paddingBottom: "0.3em",
            flexShrink: 0,
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {isRTL
            ? "חודש פיילוט זמין — דליברבלס ברורים, ממשיכים רק אם מרוצים"
            : "Pilot month available — clear deliverables, continue only if happy"}
        </motion.p>
      </div>

      {/* Desktop: horizontal steps */}
      <div className="hidden md:block">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "2vw",
            position: "relative",
          }}
        >
          {/* Connecting line */}
          <motion.div
            initial={{ scaleX: 0, transformOrigin: isRTL ? "right" : "left" }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
            style={{
              position: "absolute",
              top: "2.2rem",
              left: "10%",
              right: "10%",
              height: 1,
              background: `linear-gradient(${isRTL ? "to left" : "to right"}, var(--color-orange), rgba(26,24,20,0.15))`,
            }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: EASE }}
              style={{ position: "relative" }}
            >
              {/* Number badge */}
              <div
                style={{
                  width: "4.4rem",
                  height: "4.4rem",
                  borderRadius: "50%",
                  border: "1.5px solid rgba(26,24,20,0.15)",
                  background: "var(--color-cream-dark)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.1em",
                    color: i === 0 ? "var(--color-orange)" : "var(--color-ink-muted)",
                    fontWeight: 500,
                  }}
                >
                  {step.num}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "1.05rem",
                  color: "var(--color-ink)",
                  margin: "0 0 0.5rem",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                  color: "var(--color-ink-muted)",
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical list */}
      <div className="md:hidden" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {steps.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: isRTL ? 24 : -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.09, ease: EASE }}
            style={{ display: "flex", gap: "1.2rem", alignItems: "flex-start" }}
          >
            <div
              style={{
                flexShrink: 0,
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                border: "1.5px solid rgba(26,24,20,0.15)",
                background: "var(--color-cream-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: i === 0 ? "var(--color-orange)" : "var(--color-ink-muted)",
                }}
              >
                {step.num}
              </span>
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "var(--color-ink)",
                  margin: "0.15rem 0 0.35rem",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  lineHeight: 1.6,
                  color: "var(--color-ink-muted)",
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 1.0, ease: EASE }}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "var(--color-ink-muted)",
          marginTop: "clamp(40px, 5vw, 64px)",
          textAlign: "center",
        }}
      >
        <span style={{ color: "var(--color-orange)" }}>◆</span>{" "}
        {isRTL ? "מוכנים להתחיל? השלב הראשון תמיד חינם" : "Ready to start? First step is always free"}
      </motion.p>
    </section>
  );
};

export default ProcessTimeline;
