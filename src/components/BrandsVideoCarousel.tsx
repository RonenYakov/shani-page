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
    { file: 'mahlevet evri.mp4', title: 'תדמית מסעדה', titleEn: 'Restaurant Brand Film', category: 'קמפיין', categoryEn: 'Campaign', type: 'video' as const },
    { file: 'סרטון תדמית גלמפינג-B.mp4', title: 'גלמפינג', titleEn: 'Glamping Brand Film', category: 'תדמית', categoryEn: 'Branding', type: 'video' as const },
    { file: 'streets.mp4', title: 'שאלון רחוב', titleEn: 'Street Interview', category: 'סושיאל עסק', categoryEn: 'Social', type: 'video' as const },
    { file: 'winery.mp4', title: 'תדמית יקב', titleEn: 'Winery Brand Film', category: 'סושיאל עסק', categoryEn: 'Social', type: 'video' as const },
    { file: 'סרטון תדמית מסעדה-B.mp4', title: 'תדמית מסעדה', titleEn: 'Restaurant Brand Film', category: 'קמפיין', categoryEn: 'Campaign', type: 'video' as const },
    { file: 'סרטון תדמית מלון-B.mp4', title: 'תדמית מלון', titleEn: 'Hotel Brand Film', category: 'תדמית', categoryEn: 'Branding', type: 'video' as const },
    { file: 'ugc-B.mp4', title: 'UGC', titleEn: 'UGC Compilation', category: 'תוכן', categoryEn: 'Content', type: 'video' as const },
    { file: 'streets-ask.mp4', title: 'שאלון רחוב', titleEn: 'Street Interview', category: 'סושיאל עסק', categoryEn: 'Social', type: 'video' as const },
    { file: 'agalt-cafe.mp4', title: 'עגלת קפה', titleEn: 'Coffee Cart', category: 'סושיאל עסק', categoryEn: 'Social', type: 'video' as const },
  ];

  const brands = baseBrands.map(b => ({ ...b, src: srcFor(b.file) }));

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useWheelSnapScroll(containerRef, ".brand-card");

  const isMobile = useIsMobile();
  const [arrowTopPx, setArrowTopPx] = useState<number | null>(null);
  const [hasMoreVideos, setHasMoreVideos] = useState(false);
  const lightboxContainerRef = useRef<HTMLDivElement | null>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null);

  const toggleFullscreen = () => {
    const container: any = lightboxContainerRef.current;
    if (!container) return;
    const doc: any = document;
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      if (doc.exitFullscreen) doc.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    } else {
      if (container.requestFullscreen) container.requestFullscreen();
      else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen();
    }
  };

  // Check if there are more videos to scroll
  useEffect(() => {
    const checkMoreVideos = () => {
      const container = containerRef.current;
      if (!container) return;
      const hasOverflow = container.scrollWidth > container.clientWidth;
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
      
      if (hasOverflow && !isAtEnd) {
        setHasMoreVideos(true);
      } else {
        setHasMoreVideos(false);
      }
    };
    
    checkMoreVideos();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkMoreVideos);
      window.addEventListener('resize', checkMoreVideos);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkMoreVideos);
        window.removeEventListener('resize', checkMoreVideos);
      }
    };
  }, []);

  // Position arrows vertically aligned with the middle of the media (video/image) area
  useEffect(() => {
    const updateArrowTop = () => {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      if (!wrapper || !container) return;
      const wrapRect = wrapper.getBoundingClientRect();

      // Choose the card whose center x is nearest to the container's center x
      const contRect = container.getBoundingClientRect();
      const containerCenterX = contRect.left + contRect.width / 2;
      const cards = Array.from(container.querySelectorAll('.brand-card')) as HTMLElement[];
      let closestMedia: HTMLElement | null = null;
      let minDist = Number.POSITIVE_INFINITY;
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const cardCenterX = rect.left + rect.width / 2;
        const dist = Math.abs(cardCenterX - containerCenterX);
        if (dist < minDist) {
          minDist = dist;
          const media = (card.querySelector(':scope > .relative') as HTMLElement | null) || (card.querySelector('video, img') as HTMLElement | null);
          closestMedia = media;
        }
      }

      const mediaEl = closestMedia || (container.querySelector('video, img') as HTMLElement | null);
      if (mediaEl) {
        const mediaRect = mediaEl.getBoundingClientRect();
        const top = mediaRect.top - wrapRect.top + mediaRect.height / 2;
        setArrowTopPx(top);
        return;
      }
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

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);
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
        <div ref={containerRef} dir="ltr" className="relative overflow-x-auto overflow-y-hidden scrollbar-hide pb-8" style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}>
          {/* Gradient fade overlay on right side */}
          {hasMoreVideos && (
            <div className="absolute right-0 top-0 bottom-8 w-32 pointer-events-none z-10 bg-gradient-to-l from-[#010407] to-transparent" />
          )}
          
          <div className="flex gap-6 md:gap-8 lg:gap-10 min-w-max">
            {brands.map((item, index) => {
              return (
              <motion.div
                key={index}
                className="brand-card bg-white rounded-3xl overflow-hidden shadow-warm ring-1 ring-black/5 snap-center w-[85vw] sm:w-[70vw] md:w-[48vw] lg:w-[30vw] xl:w-[26vw] will-change-transform cursor-pointer"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onHoverStart={() => {
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
                      className="w-full aspect-video object-cover bg-gray-200"
                      autoPlay={!isMobile}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        const video = e.currentTarget;
                        video.currentTime = 0.1;
                      }}
                      onLoadedData={(e) => {
                        const video = e.currentTarget;
                        if (video.currentTime < 0.1) {
                          video.currentTime = 0.1;
                        }
                      }}
                      onCanPlay={(e) => {
                        const video = e.currentTarget;
                        if (video.currentTime < 0.1) {
                          video.currentTime = 0.1;
                        }
                      }}
                      ref={(el) => {
                        videoRefs.current[index] = el;
                        if (el) {
                          let attempts = 0;
                          const tryShowFrame = () => {
                            if (el.readyState >= 2) {
                              el.currentTime = 0.1;
                            } else if (attempts < 20) {
                              attempts++;
                              setTimeout(tryShowFrame, 100);
                            }
                          };
                          tryShowFrame();
                        }
                      }}
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
              );
            })}
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
              className="relative max-w-[92vw] max-h-[85vh] w-auto h-auto"
              ref={lightboxContainerRef}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking video
            >
              {activeItem?.type === 'image' ? (
                <img src={activeItem.src} alt={activeItem.title} className="max-w-[92vw] max-h-[85vh] w-auto h-auto object-contain" />
              ) : (
                <video
                  src={activeItem?.src}
                  className="max-w-[92vw] max-h-[85vh] w-auto h-auto object-contain"
                  controls
                  autoPlay
                  playsInline
                  onDoubleClick={toggleFullscreen}
                  ref={lightboxVideoRef}
                />
              )}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
              className="absolute top-4 right-20 z-50 text-white text-2xl bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors touch-manipulation"
              aria-label="Toggle fullscreen"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9V4h5" />
                <path d="M4 4l6 6" />
                <path d="M20 15v5h-5" />
                <path d="M20 20l-6-6" />
              </svg>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default BrandsVideoCarousel;

// Elegant scroll hint arrow for horizontal reels
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
  }, [containerRef, direction]);

  if (!show) return null;

  const onClick = () => {
    const el = containerRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.8 * (direction === 'right' ? 1 : -1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  return (
    <motion.button
      aria-label={direction === 'right' ? 'Scroll right for more videos' : 'Scroll left for more videos'}
      onClick={onClick}
      className={`group flex items-center justify-center absolute ${direction === 'right' ? 'right-4' : 'left-4'} z-30`}
      style={{ top: typeof topPx === 'number' ? topPx : '50%', transform: 'translateY(-50%)' }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        {/* Glow effect */}
        <div className={`absolute inset-0 ${direction === 'right' ? 'bg-gradient-to-r' : 'bg-gradient-to-l'} from-gold/20 to-transparent blur-xl rounded-full`} />
        
        {/* Arrow container */}
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-gold/90 to-amber-500/90 backdrop-blur-sm border-2 border-gold/50 shadow-lg shadow-gold/30 flex items-center justify-center group-hover:shadow-xl group-hover:shadow-gold/40 transition-all duration-300">
      {direction === 'right' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-cinematic-black drop-shadow-sm">
              <path d="M8 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform duration-300" />
        </svg>
      ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-cinematic-black drop-shadow-sm">
              <path d="M16 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform duration-300" />
        </svg>
      )}
        </div>
      </div>
    </motion.button>
  );
};

