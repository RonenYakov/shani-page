import { useI18n } from "@/i18n/simple";
import { socials } from "@/content/socials";
import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

const ResultsReel = () => {
  const { language } = useI18n();
  const hasCalendly = Boolean(socials.calendlyUrl);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const sectionRef = useRef<HTMLElement | null>(null);

  const handleCalendly = () => {
    if (socials.calendlyUrl) window.open(socials.calendlyUrl, '_blank');
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    setIsMuted(next);
    v.muted = next;
    if (!next) {
      try { v.volume = 1; void v.play(); } catch {}
    }
  };

  // Auto-mute when section leaves viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry.isIntersecting) {
        setIsMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
        }
      }
    }, { threshold: 0.25 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-12 md:py-16 px-6 bg-gradient-to-b from-cream to-sand/40">
      <div className="max-w-5xl mx-auto text-center">
        <div className="relative rounded-2xl overflow-hidden shadow-warm">
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            src="/recomendations.mov"
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-white text-xl md:text-2xl font-semibold">
              {language === 'he' ? 'ככה נראים התוצאות' : 'What results look like'}
            </div>
          </div>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? (language === 'he' ? 'הפעל קול' : 'Unmute') : (language === 'he' ? 'השתק קול' : 'Mute')}
            className="absolute bottom-3 right-3 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-black/60 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm transition"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {hasCalendly && (
          <button
            onClick={handleCalendly}
            className="mt-6 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-cinematic-black text-white hover:bg-cinematic-black/90 font-semibold"
          >
            {language === 'he' ? 'קבעו שיחת היכרות קצרה' : 'Book a quick call'}
          </button>
        )}
      </div>
    </section>
  );
};

export default ResultsReel;


