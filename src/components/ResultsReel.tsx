import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { socials } from "@/content/socials";
import "./ResultsReel.css";

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
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
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
                    Real Results <i>✦</i>{" "}
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

            <div className="rr-head" dir="rtl" style={{ left: "auto", right: "clamp(1.2rem, 2.5vw, 2.2rem)" }}>
              <p className="rr-kicker">
                <span className="dot">◆</span> הוכחה, לא הבטחות
              </p>
              <div className="rr-title" style={{ direction: "ltr" }}>
                What Results Look Like
              </div>
            </div>

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
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsReel;
