import { useRef, useEffect, useState } from "react";
import { MessageCircle, Calendar, Zap } from "lucide-react";
import { useI18n } from "@/i18n/simple";
import { socials } from "@/content/socials";

const ContactBlock = () => {
  const { t, language } = useI18n();
  const isRTL = language === "he";
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

  const handleWhatsApp = () => {
    const msg = language === "he"
      ? "היי שני! אני מעוניין/ת לשמוע עוד על השירותים שלך."
      : "Hi Shani! I'd like to hear more about your services.";
    window.open(`${socials.whatsappUrl}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleCalendly = () => {
    if (socials.calendlyUrl) window.open(socials.calendlyUrl, "_blank");
  };

  const features = [
    {
      icon: <Zap size={20} />,
      title: isRTL ? "מענה מהיר" : "Quick Response",
      desc: isRTL ? "תוך 24 שעות" : "Within 24 hours",
    },
    {
      icon: <Calendar size={20} />,
      title: isRTL ? "שיחת היכרות" : "Discovery Call",
      desc: isRTL ? "15 דקות חינם" : "15 minutes free",
    },
    {
      icon: <MessageCircle size={20} />,
      title: isRTL ? "תוכנית מותאמת" : "Custom Strategy",
      desc: isRTL ? "לכל עסק בנפרד" : "For each business",
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      dir={isRTL ? "rtl" : "ltr"}
      style={{
        background: "var(--color-ink)",
        padding: "clamp(6rem, 12vw, 12rem) var(--base-padding-x) clamp(5rem, 10vw, 10rem)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial glow behind the heading */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        width: "60vw",
        height: "40vw",
        background: "radial-gradient(ellipse, rgba(212,98,42,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Label */}
      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.68rem",
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: "var(--color-orange)",
        marginBottom: "1.5rem",
        position: "relative",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}>
        — 06 / {isRTL ? "צור קשר" : "CONTACT"}
      </p>

      {/* Headline — word-by-word reveal */}
      <h2 style={{
        fontFamily: isRTL ? "var(--font-display)" : "var(--font-display-en-hero)",
        fontWeight: isRTL ? 900 : 400,
        fontSize: "clamp(3rem, 7vw, 7rem)",
        lineHeight: 0.85,
        letterSpacing: isRTL ? "-0.02em" : "-0.01em",
        color: "var(--color-cream)",
        margin: "0 0 clamp(1rem, 2vw, 1.5rem)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 0.22em",
        position: "relative",
      }}>
        {(isRTL ? "בואו נצמח יחד" : "Let's Grow Together").split(" ").map((word, i) => (
          <span key={i} style={{ display: "inline-block", overflow: "hidden" }}>
            <span style={{
              display: "inline-block",
              transform: revealed ? "translateY(0)" : "translateY(110%)",
              transition: `transform 0.9s cubic-bezier(0.35,0,0,1) ${0.15 + i * 0.14}s`,
            }}>
              {word}
            </span>
          </span>
        ))}
      </h2>

      {/* Subtitle */}
      <p style={{
        fontFamily: "var(--font-body)",
        fontSize: "clamp(1rem, 1.5vw, 1.2rem)",
        color: "rgba(245,240,232,0.55)",
        maxWidth: "44ch",
        margin: "0 auto clamp(2.5rem, 4vw, 3.5rem)",
        lineHeight: 1.65,
        position: "relative",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s",
      }}>
        {isRTL
          ? "מוכנים להפוך את הסושיאל שלכם לכלי צמיחה אמיתי? בואו נתחיל."
          : "Ready to turn your social media into a real growth tool? Let's start."}
      </p>

      {/* CTA Buttons */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        justifyContent: "center",
        marginBottom: "clamp(3rem, 6vw, 5rem)",
        position: "relative",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s",
      }}>
        <button
          onClick={handleWhatsApp}
          className="cta-pulse"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            background: "var(--color-orange)",
            color: "white",
            border: "none",
            borderRadius: "9999px",
            padding: "clamp(0.85rem, 1.5vw, 1.1rem) clamp(2rem, 3vw, 2.8rem)",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
            cursor: "pointer",
            transition: "transform 0.25s ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px) scale(1.03)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)"; }}
        >
          <MessageCircle size={18} />
          {t("cta.whatsapp")}
        </button>

        {socials.calendlyUrl && (
          <button
            onClick={handleCalendly}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              background: "transparent",
              color: "var(--color-cream)",
              border: "1.5px solid rgba(245,240,232,0.3)",
              borderRadius: "9999px",
              padding: "clamp(0.85rem, 1.5vw, 1.1rem) clamp(2rem, 3vw, 2.8rem)",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              transition: "border-color 0.25s ease, transform 0.25s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,240,232,0.65)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,240,232,0.3)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            <Calendar size={18} />
            {t("cta.book")}
          </button>
        )}
      </div>

      {/* 3 feature columns */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "clamp(2rem, 6vw, 6rem)",
        flexWrap: "wrap",
        marginBottom: "clamp(2.5rem, 5vw, 4rem)",
        position: "relative",
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease 0.6s, transform 0.7s ease 0.6s",
      }}>
        {features.map((f, i) => (
          <div key={i} style={{ textAlign: "center", minWidth: "120px" }}>
            <div style={{
              width: "2.8rem",
              height: "2.8rem",
              borderRadius: "50%",
              background: "rgba(212,98,42,0.12)",
              border: "1px solid rgba(212,98,42,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 0.8rem",
              color: "var(--color-orange)",
            }}>
              {f.icon}
            </div>
            <div style={{
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.9rem",
              color: "var(--color-cream)",
              marginBottom: "0.25rem",
            }}>
              {f.title}
            </div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(245,240,232,0.4)",
            }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Social links */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "0.75rem",
        position: "relative",
        opacity: revealed ? 1 : 0,
        transition: "opacity 0.6s ease 0.75s",
      }}>
        {socials.instagram && (
          <a
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            style={{
              width: "2.6rem", height: "2.6rem", borderRadius: "50%",
              background: "rgba(245,240,232,0.06)", border: "1px solid rgba(245,240,232,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(245,240,232,0.5)", transition: "color 0.25s, background 0.25s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-orange)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,98,42,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,0.5)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(245,240,232,0.06)"; }}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        )}
        {socials.tiktok && (
          <a
            href={socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            style={{
              width: "2.6rem", height: "2.6rem", borderRadius: "50%",
              background: "rgba(245,240,232,0.06)", border: "1px solid rgba(245,240,232,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "rgba(245,240,232,0.5)", transition: "color 0.25s, background 0.25s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-orange)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,98,42,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(245,240,232,0.5)"; (e.currentTarget as HTMLAnchorElement).style.background = "rgba(245,240,232,0.06)"; }}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
        )}
      </div>
    </section>
  );
};

export default ContactBlock;
