import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/i18n/simple";
import faqData from "@/content/faq.json";

type FaqItem = { id: string; question: { he: string; en: string }; answer: { he: string; en: string } };

// Single accordion row with animated height
const FaqRow = ({
  item,
  index,
  isOpen,
  onToggle,
  language,
  isRTL,
  revealed,
}: {
  item: FaqItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  language: string;
  isRTL: boolean;
  revealed: boolean;
}) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const num = String(index + 1).padStart(2, "0");

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        borderBottom: "1px solid rgba(26,24,20,0.1)",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : `translateY(${isRTL ? -20 : 20}px)`,
        transition: `opacity 0.55s cubic-bezier(0.35,0,0,1) ${index * 60}ms, transform 0.65s cubic-bezier(0.35,0,0,1) ${index * 60}ms`,
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          padding: "clamp(1.1rem, 2vh, 1.6rem) 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: isRTL ? "right" : "left",
        }}
      >
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: isOpen ? "var(--color-orange)" : "rgba(26,24,20,0.35)",
          flexShrink: 0,
          transition: "color 0.3s ease",
          minWidth: "2rem",
        }}>
          {num}
        </span>

        <span style={{
          flex: 1,
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
          color: isOpen ? "var(--color-orange)" : "var(--color-ink)",
          lineHeight: 1.3,
          transition: "color 0.3s ease",
        }}>
          {item.question[language as "he" | "en"]}
        </span>

        {/* Plus / minus indicator */}
        <span style={{
          flexShrink: 0,
          width: "1.6rem",
          height: "1.6rem",
          borderRadius: "50%",
          border: `1.5px solid ${isOpen ? "var(--color-orange)" : "rgba(26,24,20,0.2)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "border-color 0.3s ease",
        }}>
          <svg
            width="10" height="10" viewBox="0 0 10 10"
            style={{ transition: "transform 0.4s cubic-bezier(0.35,0,0,1)", transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            <line x1="5" y1="0" x2="5" y2="10" stroke={isOpen ? "var(--color-orange)" : "var(--color-ink)"} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="5" x2="10" y2="5" stroke={isOpen ? "var(--color-orange)" : "var(--color-ink)"} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* Animated answer */}
      <div style={{ height: `${height}px`, overflow: "hidden", transition: "height 0.45s cubic-bezier(0.35,0,0,1)" }}>
        <div ref={bodyRef} style={{ paddingBottom: "1.4rem", paddingRight: isRTL ? "0" : "3.5rem", paddingLeft: isRTL ? "3.5rem" : "0" }}>
          <p style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
            color: "var(--color-ink-muted)",
            lineHeight: 1.7,
            margin: 0,
          }}>
            {item.answer[language as "he" | "en"]}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const { language } = useI18n();
  const isRTL = language === "he";
  const [openId, setOpenId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); ob.disconnect(); } },
      { threshold: 0.1 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  return (
    <section
      id="faq"
      ref={sectionRef}
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background: "var(--color-cream)",
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,24,20,0.04) 0%, transparent 70%), repeating-linear-gradient(88deg, var(--color-line) 0px, var(--color-line) 1px, transparent 1px, transparent 80px)",
        padding: "clamp(5rem, 10vw, 10rem) var(--base-padding-x)",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)", textAlign: "center" }}>
        <p style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.68rem",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          color: "var(--color-orange)",
          marginBottom: "1rem",
          opacity: revealed ? 1 : 0,
          transform: revealed ? "translateY(0)" : "translateY(10px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          — 05 / FAQ
        </p>
        <h2 style={{
          fontFamily: isRTL ? "var(--font-display)" : "var(--font-display-en-hero)",
          fontWeight: isRTL ? 900 : 400,
          fontSize: "clamp(3rem, 7vw, 7rem)",
          lineHeight: 0.88,
          letterSpacing: isRTL ? "-0.02em" : "-0.01em",
          color: "var(--color-ink)",
          margin: 0,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 0.22em",
        }}>
          {(isRTL ? "שאלות נפוצות" : "Common Questions").split(" ").map((word, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
              <span style={{
                display: "inline-block",
                transform: revealed ? "translateY(0)" : "translateY(110%)",
                transition: `transform 0.85s cubic-bezier(0.35,0,0,1) ${0.1 + i * 0.13}s`,
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
          opacity: revealed ? 1 : 0,
          transition: "opacity 0.6s ease 0.3s",
          margin: "0.9rem auto 0",
        }} />
      </div>

      {/* Accordion list */}
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        {(faqData as FaqItem[]).map((item, i) => (
          <FaqRow
            key={item.id}
            item={item}
            index={i}
            isOpen={openId === item.id}
            onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            language={language}
            isRTL={isRTL}
            revealed={revealed}
          />
        ))}
      </div>

      {/* Bottom note */}
      <p style={{
        marginTop: "clamp(2rem, 4vw, 3.5rem)",
        textAlign: "center",
        fontFamily: "var(--font-mono)",
        fontSize: "0.6rem",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: "var(--color-ink-muted)",
        opacity: revealed ? 1 : 0,
        transition: "opacity 0.6s ease 0.8s",
      }}>
        <span style={{ color: "var(--color-orange)" }}>◆</span>{" "}
        {isRTL ? "יש לכם שאלה נוספת? שלחו לי הודעה" : "Have another question? Send me a message"}
      </p>
    </section>
  );
};

export default FAQ;
