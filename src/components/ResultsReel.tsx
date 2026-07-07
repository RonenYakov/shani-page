import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { socials } from "@/content/socials";
import "./ResultsReel.css";

/* inline speaker icons — same hairline stroke style as the site's other SVGs */
const SpeakerBody = () => (
  <path d="M11 4.6 6.6 8.4H3.4v7.2h3.2L11 19.4V4.6z" />
);
const SoundOnIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <SpeakerBody />
    <path d="M15.2 9.2a4 4 0 0 1 0 5.6M18 6.6a8 8 0 0 1 0 10.8" />
  </svg>
);
const SoundOffIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <SpeakerBody />
    <path d="m15.5 9.5 5 5M20.5 9.5l-5 5" />
  </svg>
);

// Thin elegant spine — single sweeping curve drawn by scroll
const SPINE = "M -60 200 C 300 80, 560 520, 820 420 C 1080 320, 1240 560, 1480 480";

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function mapRange(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const clamped = Math.max(inMin, Math.min(inMax, val));
  return outMin + ((clamped - inMin) / (inMax - inMin)) * (outMax - outMin);
}

const MARQUEE_ITEMS = 4;

const ResultsReel = () => {
  const hasCalendly = Boolean(socials.calendlyUrl);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const reduceMotion = useReducedMotion();
  // the page's single blur-in — desktop only (blur filters are expensive on
  // mobile GPUs) and manually gated (MotionConfig doesn't cover `filter`)
  const blurIn = !isMobile && !reduceMotion;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const outerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ── scroll driver: spine draws, then the video frame rises ──
  useEffect(() => {
    const outer = outerRef.current;
    const path = pathRef.current;
    const frame = frameRef.current;
    if (!outer || !path || !frame) return;

    const len = path.getTotalLength();

    // reduced motion: skip the scroll choreography — spine fully drawn, frame at rest
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      path.style.strokeDasharray = "none";
      path.style.strokeDashoffset = "0";
      frame.style.transform = "translateY(0)";
      return;
    }

    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len * 0.97);
    const mobileNow = window.innerWidth < 768;
    frame.style.transform = `translateY(${mobileNow ? window.innerHeight * 0.5 : window.innerHeight * 1.05}px)`;

    const update = () => {
      const rect = outer.getBoundingClientRect();
      const totalRange = outer.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / totalRange));

      const spinePct = mapRange(progress, 0, 0.6, 0.03, 1);
      path.style.strokeDashoffset = String(len * (1 - spinePct));

      const mobile = window.innerWidth < 768;
      const riseStart = mobile ? 0.2 : 0.4;
      const riseEnd = mobile ? 0.72 : 0.88;
      const maxY = mobile ? window.innerHeight * 0.5 : window.innerHeight * 1.05;
      const vidPct = easeOutCubic(mapRange(progress, riseStart, riseEnd, 0, 1));
      frame.style.transform = `translateY(${(1 - vidPct) * maxY}px)`;
      ticking = false;
    };

    // rAF-throttled scroll handler (same pattern as Hero)
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── auto-mute when off screen ──
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const ob = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          setIsMuted(true);
          if (videoRef.current) videoRef.current.muted = true;
        }
      },
      { threshold: 0.25 }
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    setIsMuted(next);
    v.muted = next;
    if (!next) {
      try { v.volume = 1; void v.play(); } catch { /* autoplay restrictions */ }
    }
  };

  return (
    <div
      className="shani-results"
      ref={outerRef}
      id="results"
      style={{ height: isMobile ? "150vh" : "170vh" }}
    >
      <div className="rr-sticky">
        {/* ── background: outlined marquee + rose spine ── */}
        <div className="rr-bg">
          <div className="rr-marquee" aria-hidden="true">
            {[0, 1].map((half) => (
              <div className="rr-marquee-inner" key={half}>
                {Array.from({ length: MARQUEE_ITEMS }).map((_, i) => (
                  <span key={i}>
                    Real Results <i>+</i>{" "}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <svg className="rr-spine" viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <path
              ref={pathRef}
              d={SPINE}
              fill="none"
              stroke="var(--rose)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* ── video frame — rises from below via JS ── */}
        <div className="rr-frame-zone">
          <div className="rr-frame" ref={frameRef}>
            <video
              ref={videoRef}
              src="/recomendations.mp4"
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
            />
            <div className="rr-grad" />

            <motion.div
              className="rr-head"
              dir="rtl"
              style={{ left: "auto", right: "clamp(1.2rem, 2.5vw, 2.2rem)" }}
              initial={blurIn ? { opacity: 0, filter: "blur(6px)" } : false}
              whileInView={blurIn ? { opacity: 1, filter: "blur(0px)" } : undefined}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.9, ease: [0.35, 0, 0, 1] }}
            >
              <p className="rr-kicker">
                <span className="dot" aria-hidden="true" /> הוכחה, לא הבטחות
              </p>
              <div className="rr-title" style={{ direction: "ltr" }}>
                What Results Look Like
              </div>
            </motion.div>

            {hasCalendly && (
              <button
                className="rr-cta"
                onClick={() => socials.calendlyUrl && window.open(socials.calendlyUrl, "_blank")}
              >
                קבעו שיחת היכרות
              </button>
            )}

            <button
              type="button"
              className="rr-mute"
              onClick={toggleMute}
              aria-label={isMuted ? "הפעל קול" : "השתק"}
            >
              {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsReel;
