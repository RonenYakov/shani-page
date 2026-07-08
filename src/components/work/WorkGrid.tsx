import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { createPortal } from 'react-dom'
import { useLenis } from 'lenis/react'
import { useTilt } from '@/hooks/useTilt'
import './WorkGrid.css'
import { WorkMedia, WORK_MEDIA } from '@/content/workMedia'
import { getMedia } from "../../lib/supabase";
const EASE: [number, number, number, number] = [0.35, 0, 0, 1]

// ─── Per-niche palette ────────────────────────────────────────────────────────
interface NichePalette {
  bg: string
  cardBg: string
  accent: string
  accentText: string // text on accent (button label)
  heading: string
  body: string
  muted: string
  divider: string
  scrollbar: string
}

const PALETTES: Record<string, NichePalette> = {
  photoshoot: {
    bg: '#FAF6F1',
    cardBg: '#F1E9DF',
    accent: '#B08D6A',
    accentText: '#fff',
    heading: '#2E2218',
    body: '#5A4A39',
    muted: '#9A8A78',
    divider: 'rgba(46,34,24,0.1)',
    scrollbar: 'rgba(176,141,106,0.4)',
  },
  weddings: {
    bg: '#FBF4F0',
    cardBg: '#F5EBE6',
    accent: '#C4899A',
    accentText: '#fff',
    heading: '#3A1520',
    body: '#5C2E3A',
    muted: '#9C6B77',
    divider: 'rgba(58,21,32,0.12)',
    scrollbar: 'rgba(196,137,154,0.4)',
  },
  management: {
    // dark finale palette — same warm near-black + rose family as ContactBlock
    bg: '#0D0A0B',
    cardBg: '#171113',
    accent: '#F2B1B1',
    accentText: '#241b1b',
    heading: '#FBF6F5',
    body: '#C9BFC1',
    muted: '#8A7D80',
    divider: 'rgba(251,246,245,0.1)',
    scrollbar: 'rgba(242,177,177,0.5)',
  },
  ugc: {
    bg: '#F8F2F5',
    cardBg: '#F1E7EC',
    accent: '#E08F8F',
    accentText: '#fff',
    heading: '#2E1B26',
    body: '#5A4150',
    muted: '#9A7A8B',
    divider: 'rgba(46,27,38,0.1)',
    scrollbar: 'rgba(224,143,143,0.4)',
  },
}

// Minimal round arrow button for the DetailView reel — outline, fills with accent on hover.
const reelArrowStyle = (p: NichePalette): React.CSSProperties => ({
  width: 38,
  height: 38,
  borderRadius: '50%',
  border: `1px solid ${p.divider}`,
  background: 'transparent',
  color: p.muted,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'background 0.2s ease, color 0.2s ease',
})

// ─── Data ─────────────────────────────────────────────────────────────────────
interface WorkItem {
  id: string
  paletteKey: keyof typeof PALETTES
  tags: string
  title: string
  coverAsset: string
  coverPosition?: string
  coverOverlay?: string
  description: string
  services: string[]
}

const WORK_ITEMS: WorkItem[] = [
  {
    id: 'weddings',
    paletteKey: 'weddings',
    tags: 'חתונות • וידאו • רגעים',
    title: 'סושיאל חתונות',
    coverAsset: '/category/wed.webp',
    description:
      "ניהול וצילום תוכן קולנועי (רילס, טיקטוק) ישירות מתוך אירוע החתונה שלכם. אנחנו לא רק מתעדים, אלא יוצרים Buzz סביב הרגעים המרגשים ביותר. בעזרת ציוד מקצועי ורחפן, אנחנו לוכדים זוויות ייחודיות שהאורחים שלכם ירצו לשתף. אני באה להפוך את היום המיוחד שלכם להכי קסום שיש בעזרת ליווי מההתארגנות ועד הריקודים, לתפוס כל רגע קטן שלא תשכחו לעד.",
    services: ['וידאו חתונות', 'רילס ותוכן', 'אינסטגרם סטוריז', 'עריכה'],
  },
  {
    id: 'management',
    paletteKey: 'management',
    tags: 'קידום עסקים • סושיאל • יצירת לידים',
    title: 'ניהול סושיאל',
    coverAsset: '/category/manegment-cover.webp',
    coverPosition: 'center',
    coverOverlay: 'rgba(242,177,177,0.18)',
    description:
      "אנחנו בונים לעסק מנוע צמיחה דיגיטלי המבוסס על תוכן אורגני ויראלי, ניתוח אלגוריתמים ומערך הבאת לידים חכם. השירות כולל ניהול שוטף וימי צילום ברמה הכי גבוהה בשוק, אופטימיזציה לביצועים ואופציה לקידום ממומן ממוקד, קריאייטיב מדויק והכי חשוב ניצור סביבת עבודה שרק תצמח. הכל כדי להפוך צפיות לתוצאות עסקיות בשטח.",
    services: ['הפקת וידאו תדמית', 'צילום מוצר', 'סטוריז ורילס', 'קידום ממומן'],
  },
  {
    id: 'photoshoot',
    paletteKey: 'photoshoot',
    tags: 'סושיאל • ימי צילום • תוכן',
    title: 'צילומי סושיאל',
    coverAsset: '/category/photoshoot-cover.webp',
    coverPosition: 'center',
    coverOverlay: 'rgba(180,120,60,0.22)',
    description: 'יום צילום מרוכז ומדויק לעסקים שרוצים להרים את הרמה של הנראות שלהם בלי התחייבות לניהול חודשי. ביום אחד אנחנו מייצרים לכם "בנק תוכן" של סרטונים ותמונות בסטנדרט גבוה, מותאמים לטרנדים הכי חמים, כך שיהיה לכם תוכן איכותי להעלות בעצמכם לאורך חודש שלם. זה הפתרון האידיאלי למי שצריך תוצאה מקצועית ומהירה במינימום זמן ומקסימום אימפקט ויזואלי.',
    services: ['תוכן UGC', 'רילס וטיקטוק', 'ניהול קמפיינים', 'אסטרטגיה'],
  },
  {
    id: 'ugc',
    paletteKey: 'ugc',
    tags: 'המלצות • UGC • תוכן גולשים',
    title: 'המלצות ו-UGC',
    coverAsset: '/category/reco-cover.webp',
    description:
      'הכוח של המלצה אמיתית: תוכן גולשים (UGC) והמלצות מצולמות של לקוחות מרוצים הם הכלי החזק ביותר לבניית אמון. אנחנו מפיקים סרטוני המלצות אותנטיים וקליפים בסגנון UGC שמרגישים אמיתיים, מדברים בגובה העיניים, וגורמים ללקוחות הבאים להגיד כן.',
    services: ['סרטוני המלצות', 'תוכן UGC', 'עדויות לקוחות', 'קריאייטיב'],
  },
]

// ─── Featured cards — the 4 categories shown on the page ─────────────────────
interface FeaturedCard {
  itemId: string
  n: string
  /** English header — design language of the new hero */
  title: string
  desc: string
  chip: string
}

const FEATURED: FeaturedCard[] = [
  {
    itemId: 'weddings',
    n: '01',
    title: 'Weddings and events',
    desc: 'סטוריז חיים, רילס וסרטוני תקציר, ישר מתוך היום הגדול.',
    chip: 'live stories',
  },
  {
    itemId: 'photoshoot',
    n: '02',
    title: 'Photoshoot Days',
    desc: 'יום צילום אחד: בנק תוכן שלם של סרטונים ותמונות.',
    chip: 'shoot day',
  },
  {
    itemId: 'ugc',
    n: '03',
    title: 'Recommendations videos',
    desc: 'המלצות אמיתיות ותוכן גולשים שבונים אמון וממירים.',
    chip: 'real talk',
  },
  {
    itemId: 'management',
    n: '04',
    title: 'Social Management',
    desc: 'אסטרטגיה, לוח תוכן וצמיחה: מנוע דיגיטלי לעסק שלכם.',
    chip: 'the feed',
  },
]

// ─── Main section ─────────────────────────────────────────────────────────────
const WorkGrid = () => {
  const [selected, setSelected] = useState<WorkItem | null>(null)
  const headRef = useRef<HTMLHeadingElement>(null)
  const headInView = useInView(headRef, { once: true, margin: '-60px' })

  const handleWhatsApp = () => {
    window.open('https://wa.me/message/D4AOECDSG35YE1', '_blank')
  }

  return (
    <>
      <section className="shani-work" id="work">
        {/* ── label + lead ── */}
        <div className="wg-top">
          <motion.div
            className="wg-labelwrap"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <i className="wg-cross" />
            <div className="wg-label">
              View the
              <br />
              latest work
            </div>
          </motion.div>

          <motion.p
            className="wg-lead"
            dir="rtl"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
          >
            מבחר עבודות מארבעת התחומים האהובים עלי, שבהם אני עוזרת ללקוחות לצמוח.{' '}
            <b>לחצו על קטגוריה</b> לצפייה בפרויקטים המלאים.
          </motion.p>
        </div>

        {/* ── giant centered headline ── */}
        <h2 className="wg-giant" ref={headRef}>
          {['The', 'Work'].map((word, i) => (
            <span className="wg-word" key={word}>
              <motion.span
                className={i === 1 ? 'ac' : undefined}
                initial={{ y: '110%' }}
                animate={headInView ? { y: 0 } : {}}
                transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>

        {/* ── 4 staggered cards ── */}
        <div className="wg-cards">
          {FEATURED.map((card, i) => {
            const item = WORK_ITEMS.find(w => w.id === card.itemId)
            if (!item) return null
            return (
              <WorkCard
                key={card.itemId}
                card={card}
                item={item}
                index={i}
                onClick={() => setSelected(item)}
              />
            )
          })}
        </div>

        {/* mobile-only hint: the cards scroll sideways to reveal more categories */}
        <div className="wg-swipe" aria-hidden="true">
          <span className="wg-swipe-label">Swipe for more</span>
          <span className="wg-swipe-arrow">→</span>
        </div>
      </section>

      {/* ── Detail overlay ── */}
      <AnimatePresence>
        {selected && (
          <DetailView
            item={selected}
            onClose={() => setSelected(null)}
            onWhatsApp={handleWhatsApp}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface WorkCardProps {
  card: FeaturedCard
  item: WorkItem
  index: number
  onClick: () => void
}

const WorkCard = ({ card, item, index, onClick }: WorkCardProps) => {
  const tilt = useTilt(4, -6)
  return (
    <motion.div
      className="wg-slot"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: EASE }}
    >
      <motion.div
        className="wg-cat"
        style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY, y: tilt.y }}
        onMouseMove={tilt.onMouseMove}
        onMouseEnter={tilt.onMouseEnter}
        onMouseLeave={tilt.onMouseLeave}
        onClick={() => {
          tilt.reset() // flatten before the shared-element transition measures the card
          onClick()
        }}
      >
        <motion.div className="wg-cat-media" layoutId={`card-img-${item.id}`}>
          <img
            src={item.coverAsset}
            alt={item.title}
            loading="lazy"
            style={{ objectPosition: item.coverPosition ?? 'center' }}
          />
          {item.coverOverlay && (
            <div style={{ position: 'absolute', inset: 0, background: item.coverOverlay, mixBlendMode: 'multiply' }} />
          )}
        </motion.div>
        <div className="wg-scrim" />
        <span className="wg-idx">{card.n}</span>
        <span className="wg-chip">
          <span className="dot" />
          {card.chip}
        </span>
        <div className="wg-meta" dir="rtl">
          <h4>{card.title}</h4>
          <p>{card.desc}</p>
          <span className="wg-view">
            View Work <span className="arr">→</span>
          </span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Video lightbox ───────────────────────────────────────────────────────────
const VideoLightbox = ({ src, onClose }: { src: string; onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (v) { v.muted = false; v.volume = 1; void v.play() }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'rgba(0,0,0,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          borderRadius: 16,
          overflow: 'hidden',
          background: '#000',
        }}
      >
        <video
          ref={videoRef}
          src={src}
          controls
          autoPlay
          preload="none"
          playsInline
          style={{ display: 'block', maxWidth: '90vw', maxHeight: '90vh', width: 'auto', height: 'auto' }}
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', lineHeight: 1,
          }}
        >✕</button>
      </motion.div>
    </motion.div>
  )
}

// A connection this constrained shouldn't get extra, unrequested downloads —
// keep today's exact on-demand behaviour for those users instead of prefetching ahead.
function hasSlowConnection() {
  const conn = (navigator as unknown as {
    connection?: { saveData?: boolean; effectiveType?: string }
  }).connection
  if (!conn) return false
  return !!conn.saveData || ['slow-2g', '2g', '3g'].includes(conn.effectiveType ?? '')
}

// ─── Lazy video — plays only while on-screen (keeps scroll smooth) ──────────────
const LazyVideo = ({ src, style }: { src: string; style: React.CSSProperties }) => {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Never competes with anything more urgent already in flight — yields on contention.
    el.setAttribute('fetchpriority', 'low')

    // Unchanged: play/pause exactly at the same visibility threshold as before.
    const visibilityIo = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.play().catch(() => { }) }
        else { el.pause() }
      },
      { threshold: 0.25 },
    )
    visibilityIo.observe(el)

    // New: on fast connections, start fetching bytes slightly before the tile is on
    // screen so playback is instant once it actually becomes visible. Purely a
    // buffering head start — it never plays or shows anything early.
    let prefetchIo: IntersectionObserver | undefined
    if (!hasSlowConnection()) {
      prefetchIo = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.preload = 'auto'
            prefetchIo?.disconnect()
          }
        },
        { rootMargin: '300px' },
      )
      prefetchIo.observe(el)
    }

    return () => {
      visibilityIo.disconnect()
      prefetchIo?.disconnect()
    }
  }, [])
  return <video ref={ref} src={src} muted loop playsInline preload="none" style={style} />
}

// ─── Detail view ──────────────────────────────────────────────────────────────
interface DetailViewProps {
  item: WorkItem
  onClose: () => void
  onWhatsApp: () => void
}

const DetailView = ({ item, onClose, onWhatsApp }: DetailViewProps) => {
  const p = PALETTES[item.paletteKey]
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [media, setMedia] = useState<WorkMedia>(
    () => WORK_MEDIA[item.id] ?? { videos: [], photos: [] }
  )
  // horizontal reel + its prev/next arrow controls
  const reelRef = useRef<HTMLDivElement>(null)
  const [canScrollReel, setCanScrollReel] = useState(false)

  // Jump the reel one "card" over. dir = 1 → next (forward), -1 → previous.
  // The reel is RTL, so "forward" means scrolling toward negative scrollLeft.
  const scrollReel = (dir: 1 | -1) => {
    const el = reelRef.current
    if (!el) return
    const first = el.firstElementChild as HTMLElement | null
    const step = first ? first.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: -dir * step, behavior: 'smooth' })
  }
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Freeze Lenis smooth-scroll while the overlay is open (so the page behind can't
  // move); `data-lenis-prevent` on the overlay lets it scroll natively. Resume on close.
  const lenis = useLenis()
  useEffect(() => {
    lenis?.stop()
    return () => { lenis?.start() }
  }, [lenis])

  useEffect(() => {
    const fallback = WORK_MEDIA[item.id] ?? { videos: [], photos: [] }
    // Public read: query Supabase DIRECTLY (always-on), so visitors always see the
    // current media even when the Express/Render server is asleep. Falls back to the
    // build-time committed list only if Supabase itself is unreachable.
    getMedia(item.id)
      .then(data => setMedia(data))
      .catch(() => setMedia(fallback))
  }, [item.id])

  // Only show the arrow controls when the reel actually overflows its box.
  useEffect(() => {
    const el = reelRef.current
    if (!el) return
    const check = () => setCanScrollReel(el.scrollWidth - el.clientWidth > 8)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [media, isMobile])

  const videos = media.videos
  const hasVideos = videos.length > 0
  const galleryItems = media.photos

  return createPortal(
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.72, ease: EASE }}
      dir="rtl"
      data-lenis-prevent
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: p.bg,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* ── Fixed nav — floats over hero ── */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        padding: '1.4rem var(--base-padding-x)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}>
        <button
          onClick={onClose}
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.22)',
            color: '#fff',
            borderRadius: '9999px',
            padding: '0.55rem 1.4rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          חזרה
        </button>
        <span style={{
          pointerEvents: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.7)',
        }}>
          {item.tags}
        </span>
      </nav>

      {/* ── Full-bleed full-viewport hero (dvh: stable under mobile URL-bar resize) ── */}
      <div style={{ position: 'relative', height: '100dvh', overflow: 'hidden' }}>
        <motion.div
          layoutId={`card-img-${item.id}`}
          style={{ position: 'absolute', inset: 0 }}
        >
          <img
            src={item.coverAsset}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>

        {/* Dark gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.35) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Title at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 'clamp(2.5rem, 5vh, 5rem)',
          left: 'var(--base-padding-x)',
          right: 'var(--base-padding-x)',
        }}>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, delay: 0.25, ease: EASE }}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(3.5rem, 9vw, 10rem)',
                lineHeight: 0.88,
                letterSpacing: '-0.02em',
                color: '#fff',
                margin: 0,
              }}
            >
              {item.title}
            </motion.h2>
          </div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
            style={{
              height: 3,
              background: p.accent,
              marginTop: '1.2rem',
              width: '5rem',
              borderRadius: 99,
              transformOrigin: 'right',
            }}
          />
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          style={{
            position: 'absolute',
            bottom: '1.8rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem',
            pointerEvents: 'none',
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.48rem',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.45)',
          }}>
            גלול
          </span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.35)' }}
          />
        </motion.div>
      </div>

      {/* ── Content section ── */}
      <div style={{
        padding: 'clamp(3rem, 6vw, 6rem) var(--base-padding-x) clamp(60px, 8vw, 100px)',
        background: p.bg,
      }}>
        {/* Two-column: description + services */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '2rem' : '6vw',
          alignItems: 'start',
          marginBottom: 'clamp(3rem, 6vw, 6rem)',
        }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 1.2vw, 1.18rem)',
              lineHeight: 1.85,
              color: p.body,
            }}
          >
            {item.description}
          </motion.p>

          <div>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: p.accent,
              marginBottom: '1.2rem',
            }}>
              שירותים
            </p>
            {item.services.map((s, i) => (
              <motion.p
                key={s}
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  color: p.heading,
                  margin: '0.5rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.accent, flexShrink: 0 }} aria-hidden="true" />
                {s}
              </motion.p>
            ))}

            <motion.button
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
              onClick={onWhatsApp}
              style={{
                marginTop: '2rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: p.accent,
                color: p.accentText,
                border: 'none',
                borderRadius: '9999px',
                padding: '0.9rem 2.2rem',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              בואו נעבוד יחד
            </motion.button>
          </div>
        </div>

        {/* ── Video + gallery reel ── */}
        {(hasVideos || galleryItems.length > 0) && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ height: 1, flex: 1, background: p.divider }} />
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: p.muted,
                margin: 0,
              }}>
                עבודות
              </p>
              <div style={{ height: 1, flex: 1, background: p.divider }} />
            </div>

            {/* Prev / next arrows — jump the reel one card at a time. Shown only when it overflows. */}
            <AnimatePresence>
              {canScrollReel && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '0.6rem',
                    marginBottom: '1rem',
                  }}
                >
                  {/* forward = advance to the next video (reel is RTL, so next sits to the left) */}
                  <button
                    onClick={() => scrollReel(1)}
                    aria-label="הבא"
                    style={reelArrowStyle(p)}
                    onMouseEnter={e => (e.currentTarget.style.background = p.accent, e.currentTarget.style.color = p.accentText)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = p.muted)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollReel(-1)}
                    aria-label="הקודם"
                    style={reelArrowStyle(p)}
                    onMouseEnter={e => (e.currentTarget.style.background = p.accent, e.currentTarget.style.color = p.accentText)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = p.muted)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              ref={reelRef}
              style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '1.2rem',
                scrollbarWidth: 'thin',
                scrollbarColor: `${p.scrollbar} transparent`,
              }}>
              {/* Videos — tall 9:16 ratio, click to open lightbox */}
              {videos.map((src, i) => (
                <motion.div
                  key={`v-${i}`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
                  onClick={() => setLightboxSrc(src)}
                  style={{
                    flexShrink: 0,
                    width: 'clamp(160px, 22vw, 300px)',
                    aspectRatio: '9/16',
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: p.cardBg,
                    border: `1px solid ${p.divider}`,
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <LazyVideo
                    src={src}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                  />
                  {/* Play button overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.22)',
                    transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.42)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.22)')}
                  >
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.92)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={p.accent}>
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Gallery images — landscape */}
              {galleryItems.map((src, i) => (
                <motion.div
                  key={`g-${i}`}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: videos.length * 0.1 + i * 0.08, ease: EASE }}
                  style={{
                    flexShrink: 0,
                    width: 'clamp(240px, 34vw, 500px)',
                    aspectRatio: '4/3',
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: p.cardBg,
                    border: `1px solid ${p.divider}`,
                    alignSelf: 'center',
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <VideoLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        )}
      </AnimatePresence>
    </motion.div>,
    document.body
  )
}

export default WorkGrid
