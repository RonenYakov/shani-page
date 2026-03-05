import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useWheelSnapScroll } from "@/hooks/useWheelSnapScroll";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/simple";

const WeddingsVideoGallery = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<{ src: string; poster: string; title: string } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoverTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const weddingMap = useMemo(() => (
    import.meta.glob('@/assets/weddings/*.{mp4,webm}', { query: '?url', import: 'default', eager: true }) as Record<string, string>
  ), []);

  const srcFor = (file: string) => weddingMap[`/src/assets/weddings/${file}`] as string;

  // 5 best wedding videos
  const weddingMedia = [
    { file: 'סושיאל חתונה.mp4',                             poster: '/posters/weddings/סושיאל חתונה.webp',                             title: 'סושיאל חתונה',    titleEn: 'Wedding Social',        category: 'חתונות', categoryEn: 'Weddings' },
    { file: 'מסיבת אירוסין-W.mp4',                          poster: '/posters/weddings/מסיבת אירוסין-W.webp',                          title: 'מסיבת אירוסין',   titleEn: 'Engagement Party',      category: 'חתונות', categoryEn: 'Weddings' },
    { file: 'copy_4CB7BB16-8667-4394-9EFC-4820095F619E.mp4', poster: '/posters/weddings/copy_4CB7BB16-8667-4394-9EFC-4820095F619E.webp', title: 'חתונה מיוחדת',   titleEn: 'Special Wedding',       category: 'חתונות', categoryEn: 'Weddings' },
    { file: 'חתונה-W.mp4',                                   poster: '/posters/weddings/חתונה-W.webp',                                   title: 'חתונה',          titleEn: 'Wedding',               category: 'חתונות', categoryEn: 'Weddings' },
    { file: 'proposel.mp4',                                  poster: '/posters/weddings/proposel.webp',                                  title: 'הצעת נישואין',   titleEn: 'Marriage Proposal',     category: 'מיוחד',  categoryEn: 'Special' },
  ].map(m => ({ ...m, src: srcFor(m.file) }));

  useWheelSnapScroll(containerRef, ".media-card");

  const isMobile = useIsMobile();
  const { language } = useI18n();
  const [arrowTopPx, setArrowTopPx] = useState<number | null>(null);
  const [hasMoreVideos, setHasMoreVideos] = useState(false);
  const lightboxContainerRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const checkMore = () => {
      const container = containerRef.current;
      if (!container) return;
      const hasOverflow = container.scrollWidth > container.clientWidth;
      const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
      setHasMoreVideos(hasOverflow && !isAtEnd);
    };
    checkMore();
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkMore);
      window.addEventListener('resize', checkMore);
    }
    return () => {
      if (container) container.removeEventListener('scroll', checkMore);
      window.removeEventListener('resize', checkMore);
    };
  }, []);

  useEffect(() => {
    const updateArrowTop = () => {
      const wrapper = wrapperRef.current;
      const container = containerRef.current;
      if (!wrapper || !container) return;
      const wrapRect = wrapper.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();
      const centerX = contRect.left + contRect.width / 2;
      const cards = Array.from(container.querySelectorAll('.media-card')) as HTMLElement[];
      let closestMedia: HTMLElement | null = null;
      let minDist = Number.POSITIVE_INFINITY;
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        const dist = Math.abs((rect.left + rect.width / 2) - centerX);
        if (dist < minDist) {
          minDist = dist;
          closestMedia = (card.querySelector(':scope > .relative') as HTMLElement | null) || (card.querySelector('video, img') as HTMLElement | null);
        }
      }
      const mediaEl = closestMedia || (container.querySelector('video, img') as HTMLElement | null);
      if (mediaEl) {
        const r = mediaEl.getBoundingClientRect();
        setArrowTopPx(r.top - wrapRect.top + r.height / 2);
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
    return () => { ro1.disconnect(); ro2.disconnect(); window.removeEventListener('resize', updateArrowTop); window.removeEventListener('scroll', updateArrowTop); };
  }, []);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFullscreen(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightboxOpen]);

  const handleHoverStart = (index: number) => {
    if (isMobile) return;
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setHoveredIndex(index), 300);
  };

  const handleHoverEnd = () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    setHoveredIndex(null);
  };

  return (
    <section id="videos-weddings" dir="rtl" className="section-padding relative overflow-hidden text-right bg-[#010407]">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 -right-24 w-[40rem] h-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.2),transparent_60%)]" />
      </div>

      <div className="max-w-8xl mx-auto relative px-6" ref={wrapperRef}>
        <motion.h2
          className="section-title--light text-center mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }} viewport={{ once: true }}
        >
          {language === 'he' ? 'רגעים שנשארים לנצח' : 'Moments That Last Forever'}
        </motion.h2>
        <motion.p
          className="cinematic-text text-center max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }} viewport={{ once: true }}
        >
          {language === 'he'
            ? 'חתונות, אירוסין ורגעים מיוחדים — מוגשים כסיפורים.'
            : 'Weddings, engagements and special moments — told as stories.'}
        </motion.p>

        <div ref={containerRef} dir="ltr" className="relative overflow-x-auto overflow-y-hidden scrollbar-hide pb-8" style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}>
          {hasMoreVideos && (
            <div className="absolute right-0 top-0 bottom-8 w-32 pointer-events-none z-10 bg-gradient-to-l from-[#010407] to-transparent" />
          )}
          <div className="flex gap-6 md:gap-8 lg:gap-10 min-w-max">
            {weddingMedia.map((item, index) => (
              <motion.div
                key={index}
                className="media-card bg-white rounded-3xl overflow-hidden shadow-warm ring-1 ring-black/5 snap-center w-[85vw] sm:w-[70vw] md:w-[48vw] lg:w-[30vw] xl:w-[26vw] will-change-transform cursor-pointer"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onHoverStart={() => handleHoverStart(index)}
                onHoverEnd={handleHoverEnd}
                onClick={() => { setActiveItem(item); setLightboxOpen(true); }}
              >
                <div className="relative">
                  {hoveredIndex === index ? (
                    <video
                      src={item.src}
                      className="w-full aspect-video object-cover bg-gray-900"
                      autoPlay muted loop playsInline preload="none"
                    />
                  ) : (
                    <img
                      src={item.poster}
                      alt={language === 'he' ? item.title : item.titleEn}
                      className="w-full aspect-video object-cover"
                      loading="lazy"
                    />
                  )}
                  {hoveredIndex !== index && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                          <polygon points="5,3 19,12 5,21" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <Badge className="absolute top-3 left-3 bg-gold text-cinematic-black font-semibold">
                    {language === 'he' ? item.category : item.categoryEn}
                  </Badge>
                </div>

                <div className="p-5">
                  <h3 className="text-lg md:text-xl font-semibold text-cinematic-black mb-2 leading-tight">
                    {language === 'he' ? item.title : item.titleEn}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs bg-sand/60 text-cinematic-black rounded-full">{language === 'he' ? 'אירועים' : 'Events'}</span>
                    <span className="px-2 py-1 text-xs bg-sand/60 text-cinematic-black rounded-full">{language === 'he' ? 'וידאו' : 'Video'}</span>
                  </div>
                  <Button className="w-full bg-cinematic-black text-white hover:bg-cinematic-black/90" onClick={(e) => { e.stopPropagation(); setActiveItem(item); setLightboxOpen(true); }}>
                    {language === 'he' ? 'צפייה בסרטון' : 'Watch video'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <ScrollHintArrow containerRef={containerRef} direction="right" topPx={arrowTopPx} />
        <ScrollHintArrow containerRef={containerRef} direction="left" topPx={arrowTopPx} />
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-black border-0 m-0">
          <div className="relative w-full h-full flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
            <button onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }} className="absolute top-4 right-4 z-50 text-white text-2xl bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors touch-manipulation" aria-label="Close">✕</button>
            <div className="absolute top-0 left-0 w-full h-16 z-40" onClick={() => setLightboxOpen(false)} />
            <div className="relative max-w-[92vw] max-h-[85vh] w-auto h-auto" ref={lightboxContainerRef} onClick={(e) => e.stopPropagation()}>
              <video src={activeItem?.src} className="max-w-[92vw] max-h-[85vh] w-auto h-auto object-contain" controls autoPlay playsInline onDoubleClick={toggleFullscreen} />
            </div>
            <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="absolute top-4 right-20 z-50 text-white text-2xl bg-black/50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-black/70 transition-colors touch-manipulation" aria-label="Fullscreen">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V4h5"/><path d="M4 4l6 6"/><path d="M20 15v5h-5"/><path d="M20 20l-6-6"/></svg>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WeddingsVideoGallery;

const ScrollHintArrow = ({ containerRef, direction = 'right', topPx }: { containerRef: React.RefObject<HTMLDivElement>; direction?: 'left' | 'right'; topPx?: number | null }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      const atStart = el.scrollLeft <= 4;
      setShow(hasOverflow && ((direction === 'right' && !atEnd) || (direction === 'left' && !atStart)));
    };
    update();
    el.addEventListener('scroll', update);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, [containerRef, direction]);

  if (!show) return null;

  return (
    <motion.button aria-label={direction === 'right' ? 'Scroll right' : 'Scroll left'}
      onClick={() => { const el = containerRef.current; if (el) el.scrollBy({ left: el.clientWidth * 0.8 * (direction === 'right' ? 1 : -1), behavior: 'smooth' }); }}
      className={`group flex items-center justify-center absolute ${direction === 'right' ? 'right-4' : 'left-4'} z-30`}
      style={{ top: typeof topPx === 'number' ? topPx : '50%', transform: 'translateY(-50%)' }}
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }}
    >
      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-gold/90 to-amber-500/90 backdrop-blur-sm border-2 border-gold/50 shadow-lg shadow-gold/30 flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
        {direction === 'right'
          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-cinematic-black"><path d="M8 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-cinematic-black"><path d="M16 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        }
      </div>
    </motion.button>
  );
};
