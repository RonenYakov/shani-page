import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import "./ProcessTimeline.css";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

const STEPS = [
  {
    n: "01",
    title: "Discovery",
    he: "שיחת היכרות — מותג, קהל ומטרות. מבינים מי אתם ולאן אתם רוצים להגיע.",
    en: "Intro call — brand, audience & goals. We learn who you are and where you're headed.",
  },
  {
    n: "02",
    title: "Concepts",
    he: "אסטרטגיה ולוח תוכן מותאם אישית — קונספטים שמרגישים כמו המותג שלכם.",
    en: "Strategy & a tailored content calendar — concepts that feel like your brand.",
  },
  {
    n: "03",
    title: "Production",
    he: "ימי צילום, עריכה ועיצוב — תוכן ברמה הכי גבוהה בשוק.",
    en: "Shoot days, editing & design — content at the highest level in the market.",
  },
  {
    n: "04",
    title: "Publishing",
    he: "ניהול שוטף, פרסום בזמנים הנכונים ומענה לקהילה שלכם.",
    en: "Ongoing management, perfectly-timed publishing & community replies.",
  },
  {
    n: "05",
    title: "Report & Iterate",
    he: "נתונים שמובילים להחלטות — משפרים, מדייקים וצומחים כל חודש.",
    en: "Data that drives decisions — refining, sharpening and growing every month.",
  },
];

const N = STEPS.length;

const SectionHeader = () => {
  // observe the h2 itself — the word spans are clipped while hidden, so an
  // IntersectionObserver on them would never fire
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(h2Ref, { once: true, margin: "-40px" });

  return (
  <>
    <div className="sp-top">
      <motion.div
        className="sp-labelwrap"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <i className="sp-cross" />
        <div className="sp-label">
          How we
          <br />
          get there
        </div>
      </motion.div>
      <motion.p
        className="sp-lead"
        dir="rtl"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
      >
        חמישה שלבים פשוטים — <b>מהיכרות ראשונה ועד פיד שעובד בשבילכם</b>. בלי קסמים, רק
        שיטה שמוכיחה את עצמה.
      </motion.p>
    </div>
    <h2 className="sp-giant" ref={h2Ref}>
      {["The", "Process"].map((word, i) => (
        <span className="sp-word" key={word}>
          <motion.span
            className={i === 1 ? "ac" : undefined}
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  </>
  );
};

const ProcessTimeline = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState(0);

  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── desktop: scroll scrubs the track sideways ──
  useEffect(() => {
    if (isMobile) return;
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    let raf = 0;
    const update = () => {
      const rect = outer.getBoundingClientRect();
      const total = outer.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / total));

      const maxX = track.scrollWidth - window.innerWidth;
      track.style.transform = `translate3d(${-progress * maxX}px, 0, 0)`;

      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
      setActive(Math.min(N - 1, Math.floor(progress * N)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  // ── mobile: simple vertical list with reveals ──
  if (isMobile) {
    return (
      <section className="shani-process sp-mobile" id="process">
        <SectionHeader />
        <div className="sp-msteps">
          {STEPS.map((step, i) => (
            <motion.div
              className="sp-mstep"
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: EASE }}
            >
              <span className="sp-mnum">{step.n}</span>
              <div dir="rtl" style={{ flex: 1 }}>
                <h3 style={{ direction: "ltr", textAlign: "right" }}>{step.title}</h3>
                <p>{step.he}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="shani-process" id="process" ref={outerRef} style={{ height: "280vh" }}>
      <div className="sp-sticky">
        <div className="sp-head">
          <SectionHeader />
        </div>

        <div className="sp-viewport">
          <div className="sp-track" ref={trackRef}>
            {STEPS.map((step, i) => (
              <div className={`sp-card${i === active ? " active" : ""}`} key={step.n}>
                <i className="sp-minicross" />
                <span className="sp-num">{step.n}</span>
                <h3>{step.title}</h3>
                <p dir="rtl">{step.he}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="sp-progress">
          <span className="sp-counter">
            <span className="cur">{STEPS[active].n}</span> / 05
          </span>
          <div className="sp-bar">
            <div className="sp-bar-fill" ref={fillRef} />
          </div>
          <p className="sp-note">
            <span className="dot" aria-hidden="true" />{" "}
            מוכנים להתחיל? השלב הראשון תמיד חינם
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessTimeline;
