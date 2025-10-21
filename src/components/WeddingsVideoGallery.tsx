import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useWheelSnapScroll } from "@/hooks/useWheelSnapScroll";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/simple";

const WeddingsVideoGallery = () => {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<{ src: string; type: 'image' | 'video'; title: string } | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const hoverTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Manual order + titles: edit this array freely
  const weddingMap = useMemo(() => (
    import.meta.glob('@/assets/weddings/*.{jpg,jpeg,png,webp,gif,mp4,mov,webm,HEIC,JPG,PNG}', { query: '?url', import: 'default', eager: true }) as Record<string, string>
  ), []);

  const srcFor = (file: string) => weddingMap[`/src/assets/weddings/${file}`] as string;

  const weddingMedia = ([ 
    { file: 'סושיאל חתונה.mov', title: 'סושיאל חתונה', titleEn: 'Wedding Social', type: 'video' as const },
    { file: 'save the date-tal.mov', title: 'Save the Date', titleEn: 'Save the Date', type: 'video' as const },

    { file: 'proposel.mp4', title: 'הצעה', titleEn: 'Proposal', type: 'video' as const },
    { file: 'SAVE THE DATE-W.mov', title: 'Save the Date', titleEn: 'Save the Date', type: 'video' as const },
    { file: 'wedding-tal.mov', title: 'חתונה', titleEn: 'Wedding', type: 'video' as const },
    { file: 'gan.mov', title: 'מסיבת סיום גן', titleEn: 'Kindergarten Graduation', type: 'video' as const },
    { file: 'רגעים קטנים חתונה-W.mov', title: 'רגעים קטנים', titleEn: 'Little Moments', type: 'video' as const },
    { file: 'מסיבת אירוסין-W.mov', title: 'מסיבת אירוסין', titleEn: 'Engagement Party', type: 'video' as const },
    { file: 'save the date.mov', title: 'Save the Date', titleEn: 'Save the Date', type: 'video' as const },
     ] as Array<{ file: string; title: string; titleEn: string; type: 'image' | 'video' }>).map(m => ({ ...m, src: srcFor(m.file) }));

  // Mouse-wheel snap between items when hovered
  useWheelSnapScroll(containerRef, ".media-card");

  const isMobile = useIsMobile();
  const { language } = useI18n();

  const [arrowTopPx, setArrowTopPx] = useState<number | null>(null);

  // Position arrows vertically aligned with the middle of the media (video/image) area
  useEffect(() => {
    const updateArrowTop = () => {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      if (!wrapper || !container) return;
      const wrapRect = wrapper.getBoundingClientRect();
      const mediaEl = container.querySelector('video, img') as HTMLElement | null;
      if (mediaEl) {
        const mediaRect = mediaEl.getBoundingClientRect();
        const top = mediaRect.top - wrapRect.top + mediaRect.height / 2;
        setArrowTopPx(top);
        return;
      }
      const contRect = container.getBoundingClientRect();
      setArrowTopPx(contRect.top - wrapRect.top + contRect.height / 2);
    };

    updateArrowTop();
    const ro1 = new ResizeObserver(updateArrowTop);
    const ro2 = new ResizeObserver(updateArrowTop);
    if (wrapperRef.current) ro1.observe(wrapperRef.current);
    if (containerRef.current) ro2.observe(containerRef.current);
    window.addEventListener('resize', updateArrowTop);
    window.addEventListener('scroll', updateArrowTop, { passive: true });
    return () => {
      ro1.disconnect();
      ro2.disconnect();
      window.removeEventListener('resize', updateArrowTop);
      window.removeEventListener('scroll', updateArrowTop);
    };
  }, []);
  return (
    <section id="videos-warm" dir="rtl" className="section-padding relative text-right">
      <div className="max-w-7xl mx-auto relative px-6" ref={wrapperRef}>
        <motion.h2 
          className="section-title text-center mb-2"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {language === 'he' ? 'חתונות ואירועים' : 'Wedding & Events'}
        </motion.h2>
        
        <motion.p 
          className="cinematic-text text-center max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {language === 'he' ? 'הצעות, חתונות ורגעים משפחתיים — מצולם באהבה.' : 'Proposals, weddings and family moments — captured beautifully.'}
        </motion.p>

        {/* Smooth Horizontal Reel with snap + hover scale */}
        <div
          ref={containerRef}
          dir="ltr"
          className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-10"
          style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-5 md:gap-7 lg:gap-10 min-w-max">
            {weddingMedia.map((item, index) => (
              <motion.article
                key={index}
                className="media-card bg-white rounded-3xl overflow-hidden shadow-warm ring-1 ring-black/5 snap-center w-[85vw] sm:w-[70vw] md:w-[48vw] lg:w-[30vw] xl:w-[26vw] will-change-transform cursor-pointer"
                initial={{ opacity: 0, scale: 0.95, y: 26 }}
                whileInView={{ opacity: 1, scale: 1.03, y: 0 }}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onHoverStart={() => {
                  if (item.type === 'video') {
                    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
                    hoverTimer.current = window.setTimeout(() => {
                      const v = videoRefs.current[index];
                      if (v) {
                        v.muted = false;
                        if (v.paused) {
                          try { v.currentTime = 0; void v.play(); } catch {}
                        }
                      }
                    }, 1000);
                  }
                }}
                onHoverEnd={() => {
                  if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
                  const v = videoRefs.current[index];
                  if (v) {
                    v.muted = true;
                    // Keep playing as a muted preview; if you prefer pause, uncomment:
                    // v.pause();
                  }
                }}
                onClick={() => { setActiveItem(item); setLightboxOpen(true); }}
              >
                <div className="relative">
                  {item.type === 'image' ? (
                    <img src={item.src} alt="" className="w-full aspect-video object-cover" loading="lazy" />
                  ) : (
                    <video
                      src={item.src}
                      className="w-full aspect-video object-cover"
                      autoPlay={!isMobile}
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      onCanPlay={(e) => {
                        if (!isMobile) {
                          try { (e.currentTarget as HTMLVideoElement).play(); } catch {}
                        }
                      }}
                      aria-hidden="true"
                      ref={(el) => { videoRefs.current[index] = el; }}
                    />
                  )}
                  <Badge className="absolute top-3 left-3 bg-gold text-cinematic-black font-semibold">{language === 'he' ? 'אירועים' : 'Events'}</Badge>
                </div>

                <div className="p-5">
                  <h4 className="text-lg md:text-xl font-semibold text-cinematic-black mb-2 leading-tight">{language === 'he' ? item.title : item.titleEn}</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs bg-sand/60 text-cinematic-black rounded-full">{language==='he' ? 'אירוע' : 'Event'}</span>
                    <span className="px-2 py-1 text-xs bg-sand/60 text-cinematic-black rounded-full">{language==='he' ? 'וידאו' : 'Video'}</span>
                  </div>
                  <Button className="w-full bg-cinematic-black text-white hover:bg-cinematic-black/90" onClick={(e) => { e.stopPropagation(); setActiveItem(item); setLightboxOpen(true); }}>
                    {language === 'he' ? 'צפייה בסרטון' : 'Watch video'}
                  </Button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Scroll hint arrows */}
        <ScrollHintArrow containerRef={containerRef} direction="right" topPx={arrowTopPx} />
        <ScrollHintArrow containerRef={containerRef} direction="left" topPx={arrowTopPx} />

        {/* Fullscreen Lightbox Viewer */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-none w-screen h-screen p-0 bg-black border-0 m-0">
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={() => setLightboxOpen(false)} // Click outside to close
            >
              {/* Close button - larger for mobile */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(false);
                }}
                className="absolute top-4 right-4 z-50 text-white text-2xl bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors touch-manipulation"
                aria-label="Close video"
              >
                ✕
              </button>
              
              {/* Additional close area for mobile - tap anywhere */}
              <div className="absolute top-0 left-0 w-full h-16 z-40" onClick={() => setLightboxOpen(false)} />
              
              <div 
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking video
              >
                {activeItem?.type === 'image' ? (
                  <img src={activeItem.src} alt={activeItem.title} className="max-w-full max-h-full object-contain" />
                ) : (
                  <video
                    src={activeItem?.src}
                    className="max-w-full max-h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default WeddingsVideoGallery;

// Yellow cartoon-like scroll hint arrow for horizontal reels
const ScrollHintArrow = ({ containerRef, direction = 'right', topPx }: { containerRef: React.RefObject<HTMLDivElement>; direction?: 'left' | 'right'; topPx?: number | null }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      const atStart = el.scrollLeft <= 4;
      setShow(
        hasOverflow && ((direction === 'right' && !atEnd) || (direction === 'left' && !atStart))
      );
    };
    update();
    el.addEventListener('scroll', update);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [containerRef]);

  if (!show) return null;

  const onClick = () => {
    const el = containerRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.8 * (direction === 'right' ? 1 : -1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <button
      aria-label={direction === 'right' ? 'Scroll right for more videos' : 'Scroll left for more videos'}
      onClick={onClick}
      className={`hidden md:flex items-center justify-center absolute ${direction === 'right' ? 'right-2' : 'left-2'} w-12 h-12 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg ring-1 ring-black/10 transition`}
      style={{ top: typeof topPx === 'number' ? topPx + 12 : 'calc(50% + 12px)', transform: 'translateY(-50%)' }}
    >
      {direction === 'right' ? (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      )}
    </button>
  );
};