import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { socials } from "@/content/socials";
import RotatingBadge from "./RotatingBadge";
import "./ContactBlock.css";

/* inline icons — same hairline stroke style as the rest of the site's SVGs */
const ChatIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-2.9-.36-4.1-1L3 20l1-5.4A8.5 8.5 0 1 1 21 11.5z" />
  </svg>
);
const CalendarIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
    <path d="M8 3v4M16 3v4M3.5 10.5h17" />
  </svg>
);

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

const MARQUEE_WORDS = ["Strategy", "Content", "Growth", "Stories", "Community"];

/** Primary CTA with a magnetic pull toward the cursor */
const MagneticButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const btn = ref.current;
    if (!btn) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0;
    let raf = 0;
    let running = false;

    const tick = () => {
      cx += (tx - cx) * 0.16;
      cy += (ty - cy) * 0.16;
      btn.style.transform = `translate(${cx}px, ${cy}px)`;
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1 || tx !== 0 || ty !== 0) {
        raf = requestAnimationFrame(tick);
      } else {
        btn.style.transform = "";
        running = false;
      }
    };
    const start = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      tx = relX * 0.22;
      ty = relY * 0.32;
      start();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      start();
    };

    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <button className="ct-primary" ref={ref} onClick={onClick}>
      {children}
    </button>
  );
};

const ContactBlock = () => {
  const headRef = useRef<HTMLHeadingElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  const handleWhatsApp = () => {
    const msg = "היי שני! אני מעוניין/ת לשמוע עוד על השירותים שלך.";
    window.open(`${socials.whatsappUrl}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleCalendly = () => {
    if (socials.calendlyUrl) window.open(socials.calendlyUrl, "_blank");
  };

  const chips = [
    { k: "מענה מהיר", v: "תוך 24 שעות" },
    { k: "שיחת היכרות", v: "15 דקות חינם" },
    { k: "תוכנית מותאמת", v: "לכל עסק בנפרד" },
  ];

  return (
    <section className="shani-contact" id="contact">
      <div className="ct-ribbon" aria-hidden="true" />
      <div className="ct-ribbon-veil" aria-hidden="true" />
      <div className="ct-grain" aria-hidden="true" />

      {/* scrolling word strip */}
      <div className="ct-marquee" aria-hidden="true">
        {[0, 1].map((half) => (
          <div className="ct-marquee-inner" key={half}>
            {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((w, i) => (
              <span key={i}>
                {w} <i>+</i>
              </span>
            ))}
          </div>
        ))}
      </div>

      <motion.p
        className="ct-kicker"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <span className="dot" aria-hidden="true" /> צעד אחד מסיפור שעוצר את הגלילה
      </motion.p>

      <h2 className="ct-giant" ref={headRef}>
        {["Let's", "Talk"].map((word, i) => (
          <span className="ct-word" key={word}>
            <motion.span
              className={i === 1 ? "ac" : undefined}
              initial={{ y: "110%", letterSpacing: "0.06em" }}
              animate={headInView ? { y: 0, letterSpacing: "-0.02em" } : {}}
              transition={{ duration: 1.1, delay: i * 0.14, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </h2>

      <motion.p
        className="ct-sub"
        dir="rtl"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
      >
        מוכנים להפוך את הסושיאל שלכם לכלי צמיחה אמיתי? שלחו הודעה ונבנה יחד פיד שסוף־סוף מרגיש כמו שלכם.
      </motion.p>

      <motion.div
        className="ct-ctas"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
      >
        <MagneticButton onClick={handleWhatsApp}>
          <ChatIcon />
          לפניות לחצו
        </MagneticButton>
        {socials.calendlyUrl && (
          <button className="ct-ghost" onClick={handleCalendly}>
            <CalendarIcon />
            קבעו שיחת היכרות
          </button>
        )}
      </motion.div>

      <motion.div
        className="ct-chips"
        dir="rtl"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
      >
        {chips.map((c) => (
          <span className="ct-chip" key={c.k}>
            <span className="dot" />
            <b>{c.k}</b> — {c.v}
          </span>
        ))}
      </motion.div>

      <motion.div
        className="ct-socials"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.7, ease: EASE }}
      >
        {socials.instagram && (
          <a
            className="ct-social"
            href={socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        )}
        {socials.tiktok && (
          <a
            className="ct-social"
            href={socials.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
        )}
      </motion.div>

      {/* rotating badge — echoes the hero */}
      <div className="ct-badge" aria-hidden="true">
        <RotatingBadge pathId="ctCirclePath" centerFill="#0D0A0B" />
      </div>
      <i className="ct-cross" aria-hidden="true" />
    </section>
  );
};

export default ContactBlock;
