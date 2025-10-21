import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useWheelSnapScroll } from "@/hooks/useWheelSnapScroll";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/simple";

const BrandsVideoCarousel = () => {
  const { language, t } = useI18n();
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<{ src: string; type: 'image' | 'video'; title: string } | null>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const hoverTimer = useRef<number | null>(null);

  // Manual order + text control using glob map
  const brandMap = useMemo(() => (
    import.meta.glob('@/assets/brands/*.{jpg,jpeg,png,webp,gif,mp4,mov,webm,JPG,PNG}', { query: '?url', import: 'default', eager: true }) as Record<string, string>
  ), []);

  const srcFor = (file: string) => brandMap[`/src/assets/brands/${file}`] as string;

  const baseBrands: Array<{ file: string; title: string; titleEn: string; category: string; categoryEn: string; type: 'image' | 'video' }> = [
    { file: 'mahlevet evri.mov', title: 'תדמית מסעדה', titleEn: 'Restaurant Brand Film', category: 'קמפיין', categoryEn: 'Campaign', type: 'video' as const },

    { file: 'סרטון תדמית גלמפינג-B.mov', title: 'גלמפינג', titleEn: 'Glamping Brand Film', category: 'תדמית', categoryEn: 'Branding', type: 'video' as const },
    { file: 'streets.mov', title: 'שאלון רחוב', titleEn: 'Street Interview', category: 'סושיאל עסק', categoryEn: 'Social', type: 'video' as const },
    { file: 'winery.mov', title: 'תדמית יקב', titleEn: 'Winery Brand Film', category: 'סושיאל עסק', categoryEn: 'Social', type: 'video' as const },
    { file: 'סרטון תדמית מסעדה-B.mov', title: 'תדמית מסעדה', titleEn: 'Restaurant Brand Film', category: 'קמפיין', categoryEn: 'Campaign', type: 'video' as const },
    { file: 'סרטון תדמית מלון-B.mov', title: 'תדמית מלון', titleEn: 'Hotel Brand Film', category: 'תדמית', categoryEn: 'Branding', type: 'video' as const },
    { file: 'ugc-B.mov', title: 'UGC', titleEn: 'UGC Compilation', category: 'תוכן', categoryEn: 'Content', type: 'video' as const },
    { file: 'streets-ask.mov', title: 'שאלון רחוב', titleEn: 'Street Interview', category: 'סושיאל עסק', categoryEn: 'Social', type: 'video' as const },
    { file: 'agalt-cafe.mp4', title: 'עגלת קפה', titleEn: 'Coffee Cart', category: 'סושיאל עסק', categoryEn: 'Social', type: 'video' as const },
  ];

  const brands = baseBrands.map(b => ({ ...b, src: srcFor(b.file) }));

  // wheel snap on hoverבית'פ
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useWheelSnapScroll(containerRef, ".brand-card");

  const isMobile = useIsMobile();
  const [arrowTopPx, setArrowTopPx] = useState<number | null>(null);

  // Position arrows vertically aligned with the middle of the media (video/image) area
  useEffect(() => {
    const updateArrowTop = () => {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      if (!wrapper || !container) return;
      const wrapRect = wrapper.getBoundingClientRect();
      // Try to use first media element height to avoid padding offset
      const mediaEl = container.querySelector('video, img') as HTMLElement | null;
      if (mediaEl) {
        const mediaRect = mediaEl.getBoundingClientRect();
        const top = mediaRect.top - wrapRect.top + mediaRect.height / 2;
        setArrowTopPx(top);
        return;
      }
      // Fallback to container center
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
    <section id="videos-brands" dir="rtl" className="section-padding relative overflow-hidden text-right bg-[#010407]">
      {/* Rich, premium background accents */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 -left-24 w-[40rem] h-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.25),transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_65%)]" />
      </div>
      <div className="max-w-8xl mx-auto relative px-6" ref={wrapperRef}>
        <motion.h2 
          className="section-title--light text-center mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          {language === 'he' ? 'סיפורי מותג שמניעים מכירות' : 'Brand Stories that Drive Sales'}
        </motion.h2>
        
        <motion.p 
          className="cinematic-text text-center max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {language === 'he' 
            ? 'דוגמאות קצרות מתחומי מסעדות, אירוח ומותגים מקומיים.'
            : '.Short examples across hospitality, retail and local brands'}
        </motion.p>

        {/* Horizontal reel with snap & hover scale */}
        <div ref={containerRef} dir="ltr" className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-8" style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}>
          <div className="flex gap-6 md:gap-8 lg:gap-10 min-w-max">
            {brands.map((item, index) => (
              <motion.div
                key={index}
                className="brand-card bg-white rounded-3xl overflow-hidden shadow-warm ring-1 ring-black/5 snap-center w-[85vw] sm:w-[70vw] md:w-[48vw] lg:w-[30vw] xl:w-[26vw] will-change-transform cursor-pointer"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onHoverStart={() => {
                  setHoveredVideo(index.toString());
                  if (item && item.type === 'video') {
                    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
                    hoverTimer.current = window.setTimeout(() => {
                      const v = videoRefs.current[index];
                      if (v) {
                        try {
                          v.muted = false;
                          v.currentTime = 0;
                          void v.play();
                        } catch {}
                      }
                    }, 1000);
                  }
                }}
                onHoverEnd={() => {
                  setHoveredVideo(null);
                  if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
                  const v = videoRefs.current[index];
                  if (v) {
                    v.muted = true;
                    v.pause();
                  }
                }}
                onClick={() => { setActiveItem(item); setLightboxOpen(true); }}
              >
                {/* Top: video preview */}
                <div className="relative">
                  {item.type === 'image' ? (
                    <img src={item.src} alt="" className="w-full aspect-video object-cover" loading="lazy" />
                  ) : (
                    <video
                      src={item.src}
                      className="w-full aspect-video object-cover"
                      autoPlay={!isMobile}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      ref={(el) => { videoRefs.current[index] = el; }}
                    />
                  )}
                  <Badge className="absolute top-3 left-3 bg-gold text-cinematic-black font-semibold">{language === 'he' ? item.category : item.categoryEn}</Badge>
                </div>

                {/* Bottom: content */}
                <div className="p-5">
                  <h3 className="text-lg md:text-xl font-semibold text-cinematic-black mb-2 leading-tight">{language === 'he' ? item.title : item.titleEn}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs bg-sand/60 text-cinematic-black rounded-full">{language==='he' ? 'מותג' : 'Brand'}</span>
                    <span className="px-2 py-1 text-xs bg-sand/60 text-cinematic-black rounded-full">{language==='he' ? 'וידאו' : 'Video'}</span>
                  </div>
                  <Button className="w-full bg-cinematic-black text-white hover:bg-cinematic-black/90" onClick={(e) => { e.stopPropagation(); setActiveItem(item); setLightboxOpen(true); }}>
                    {language === 'he' ? 'צפייה בסרטון' : 'Watch video'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Scroll hint arrows */}
        <ScrollHintArrow containerRef={containerRef} direction="right" topPx={arrowTopPx} />
        <ScrollHintArrow containerRef={containerRef} direction="left" topPx={arrowTopPx} />
      </div>
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
    </section>
  );
};

export default BrandsVideoCarousel;

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