import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useI18n } from '@/i18n/simple'
import { VIDEO_MANIFEST } from '@/content/videoManifest'

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
  restaurants: {
    bg: '#1C0F08',
    cardBg: '#2A1810',
    accent: '#C4622A',
    accentText: '#fff',
    heading: '#F5E8D8',
    body: '#D4C0AA',
    muted: '#8A6A50',
    divider: 'rgba(245,232,216,0.1)',
    scrollbar: 'rgba(196,98,42,0.4)',
  },
  social: {
    bg: '#080C14',
    cardBg: '#0F1422',
    accent: '#1a2ffb',
    accentText: '#fff',
    heading: '#F0F4FF',
    body: '#B0B8D0',
    muted: '#506080',
    divider: 'rgba(240,244,255,0.08)',
    scrollbar: 'rgba(26,47,251,0.5)',
  },
  savethedate: {
    bg: '#F8F0EE',
    cardBg: '#F0E5E0',
    accent: '#9B6878',
    accentText: '#fff',
    heading: '#2A1520',
    body: '#5C3040',
    muted: '#9B7080',
    divider: 'rgba(42,21,32,0.1)',
    scrollbar: 'rgba(155,104,120,0.4)',
  },
  hotels: {
    bg: '#091522',
    cardBg: '#0F2035',
    accent: '#C8A882',
    accentText: '#091522',
    heading: '#F0EBE0',
    body: '#C0B8A8',
    muted: '#607080',
    divider: 'rgba(240,235,224,0.1)',
    scrollbar: 'rgba(200,168,130,0.4)',
  },
  brands: {
    bg: '#1A1814',
    cardBg: '#231F1A',
    accent: '#D4622A',
    accentText: '#fff',
    heading: '#F5F0E8',
    body: '#C0BAB0',
    muted: '#706860',
    divider: 'rgba(245,240,232,0.1)',
    scrollbar: 'rgba(212,98,42,0.4)',
  },
}

// ─── Data ─────────────────────────────────────────────────────────────────────
interface WorkItem {
  id: string
  paletteKey: keyof typeof PALETTES
  tags: string
  tagsEn: string
  title: string
  titleEn: string
  coverAsset: string
  coverPosition?: string
  coverOverlay?: string
  description: string
  descriptionEn: string
  services: string[]
  servicesEn: string[]
  gallery: string[]
  videos?: string[]
}

const WORK_ITEMS: WorkItem[] = [
  {
    id: 'weddings',
    paletteKey: 'weddings',
    tags: 'חתונות • וידאו • רגעים',
    tagsEn: 'WEDDINGS • VIDEO • MOMENTS',
    title: 'סושיאל חתונות',
    titleEn: 'Wedding Films',
    coverAsset: '/posters/theme/weddings-social.png',
    description:
      "ניהול וצילום תוכן קולנועי (רילס, טיקטוק) ישירות מתוך אירוע החתונה שלכם. אנחנו לא רק מתעדים, אלא יוצרים Buzz סביב הרגעים המרגשים ביותר. בעזרת ציוד מקצועי ורחפן, אנחנו לוכדים זוויות ייחודיות שהאורחים שלכם ירצו לשתף. אני באה להפוך את היום המיוחד שלכם להכי קסום שיש בעזרת ליווי מההתארגנות ועד הריקודים, לתפוס כל רגע קטן שלא תשכחו לעד.",
    descriptionEn:
      'Cinematic social content (Reels, TikTok) captured live from your wedding day. We don\'t just document — we create Buzz around your most emotional moments. With professional gear and a drone, we capture unique angles your guests will want to share.',
    services: ['וידאו חתונות', 'רילס ותוכן', 'אינסטגרם סטוריז', 'עריכה'],
    servicesEn: ['Wedding Video', 'Reels & Content', 'Instagram Stories', 'Editing'],
    gallery: [
      '/posters/weddings/חתונה-W.webp',
      '/posters/weddings/מסיבת אירוסין-W.webp',
      '/posters/weddings/סושיאל חתונה.webp',
      '/posters/weddings/proposel.webp',
      '/posters/weddings/copy_4CB7BB16-8667-4394-9EFC-4820095F619E.webp',
    ],
    videos: [
      '/videos/weddings/3325b41d9ff84aac99fffe62b5818863.mp4',
      '/videos/weddings/65259cb11a2c4ddfa02131c5be588092.mp4',
      '/videos/weddings/6f0e8e98a5064a17b45c18a199e43359.mp4',
      '/videos/weddings/VID_20260321_130846_626.mp4',
      '/videos/weddings/c35aef4ab07645b99bb7903c646ecc61.mp4',
    ],
  },
  {
    id: 'restaurants',
    paletteKey: 'restaurants',
    tags: 'קידום עסקים • סושיאל • יצירת לידים',
    tagsEn: 'SOCIAL MEDIA • GROWTH • LEADS',
    title: 'ניהול סושיאל',
    titleEn: 'Social Media Management',
    coverAsset: '/posters/theme/social-managment.jpg',
    coverPosition: 'top',
    coverOverlay: 'rgba(212,98,42,0.18)',
    description:
      "אנחנו בונים לעסק מנוע צמיחה דיגיטלי המבוסס על תוכן אורגני ויראלי, ניתוח אלגוריתמים ומערך הבאת לידים חכם. השירות כולל ניהול שוטף וימי צילום ברמה הכי גבוה בשוק, אופטימיזציה לביצועים ואופציה לקידום ממומן ממוקד, קיריאייטיב מדויק והכי חשוב ניצור סיבבת עבודה שרק תצמח — הכל כדי להפוך צפיות לתוצאות עסקיות בשטח.",
    descriptionEn:
      'We build a digital growth engine for your business — organic viral content, algorithm analysis, and smart lead generation. Includes ongoing management, premium shoot days, performance optimisation, and targeted paid promotion. Everything to turn views into real business results.',
    services: ['הפקת וידאו תדמית', 'צילום מוצר', 'סטוריז ורילס', 'קידום ממומן'],
    servicesEn: ['Brand Video Production', 'Product Photography', 'Stories & Reels', 'UGC'],
    gallery: [
      '/posters/brands/סרטון תדמית מסעדה-B.webp',
      '/posters/brands/agalt-cafe.webp',
      '/posters/brands/streets.webp',
    ],
    videos: [
      '/videos/social-managment/a529c7ea-166d-46a5-91b3-ad3526017ea6.mp4',
      '/videos/social-managment/IMG_0979.mp4',
      '/videos/social-managment/IMG_1073.mp4',
      '/videos/social-managment/IMG_1682.mp4',
      '/videos/social-managment/copy_1B0F41C9-58B9-4C98-8C9F-7BCDA4318999.mp4',
      '/videos/social-managment/brand-video-restaurant.mp4',
    ],
  },
  {
    id: 'social',
    paletteKey: 'social',
    tags: 'סושיאל • ימי צילום • תוכן',
    tagsEn: 'SOCIAL • UGC • CONTENT',
    title: 'צילומי סושיאל',
    titleEn: 'Social Shoots',
    coverAsset: '/posters/theme/social-shoots.png',
    coverPosition: 'center',
    coverOverlay: 'rgba(180,120,60,0.22)',
    description: 'יום צילום מרוכז ומדויק לעסקים שרוצים להרים את הרמה של הנראות שלהם בלי התחייבות לניהול חודשי. ביום אחד אנחנו מייצרים לכם "בנק תוכן" של סרטונים ותמונות בסטנדרט גבוה, מותאמים לטרנדים הכי חמים, כך שיהיה לכם תוכן איכותי להעלות בעצמכם לאורך חודש שלם. זה הפתרון האידיאלי למי שצריך תוצאה מקצועית ומהירה במינימום זמן ומקסימום אימפקט ויזואלי.',
    descriptionEn:
      'Short-form video production (Reels, TikTok) tailored to your brand. Smart content strategy meets high production quality — videos that don\'t just look great, they drive action and boost engagement.',
    services: ['תוכן UGC', 'רילס וטיקטוק', 'ניהול קמפיינים', 'אסטרטגיה'],
    servicesEn: ['UGC Content', 'Reels & TikTok', 'Campaign Management', 'Strategy'],
    gallery: [
      '/posters/brands/ugc-B.webp',
      '/posters/brands/mahlevet evri.webp',
      '/posters/brands/agalt-cafe.webp',
    ],
    videos: [
      '/videos/social/VID_20260321_125846_870.mp4',
      '/videos/social/a553ec9620b24d8b8ad319a889ab3821.mp4',
      '/videos/social/f876f334e71347faa8ad4779a37b5759.mp4',
      '/videos/social/IMG_2424.mp4',
      '/videos/social/copy_9BB61E2F-0894-4FB9-B7F3-C301CDDBF5D7.mp4',
    ],
  },
  {
    id: 'savethedate',
    paletteKey: 'savethedate',
    tags: 'סייב דה דייט • הצעה • אירוסין',
    tagsEn: 'SAVE THE DATE • PROPOSAL • ENGAGEMENT',
    title: 'סייב דה דייט',
    titleEn: 'Save the Date',
    coverAsset: '/posters/theme/save-the-date.png',
    description:
      'יצירת תוכן וידאו מקורי ומפתיע שיגרום לכל האורחים לסמן את התאריך. מרעיון קריאטיבי ועד צילום אווירי ברחפן — ה-Save the Date שלכם יהיה בלתי נשכח ובעל פוטנציאל ויראלי גבוה.',
    descriptionEn:
      'Original, surprising video content that makes every guest mark the date. From creative concept to aerial drone footage — your Save the Date will be unforgettable and highly shareable.',
    services: ['סרטוני הצעה', 'אירוסין', 'סייב דה דייט', 'רגעים'],
    servicesEn: ['Proposal Videos', 'Engagement', 'Save the Date', 'Moments'],
    gallery: [
      '/posters/weddings/proposel.webp',
      '/posters/weddings/מסיבת אירוסין-W.webp',
      '/posters/weddings/סושיאל חתונה.webp',
    ],
    videos: [
      '/videos/savethedate/cf88b840faff4eb49de37d27f6079602.mp4',
      '/videos/savethedate/6f0e8e98a5064a17b45c18a199e43359-1.mp4',
      '/videos/savethedate/IMG_9684.mp4',
    ],
  },
  {
    id: 'hotels',
    paletteKey: 'hotels',
    tags: 'מלונות • חופשות • דרון',
    tagsEn: 'HOTELS • VACATIONS • DRONE',
    title: 'צילומי מלונאות',
    titleEn: 'The Great Escape',
    coverAsset: '/posters/theme/hotels.png',
    description:
      'אנו משתמשים בצילום אווירי ברחפן להדגשת הנוף המרהיב ובצילום קרוב ללכידת פרטי החופשה המושלמת. תוכן שמוכר חווייה — לא רק חדר.',
    descriptionEn:
      'Aerial drone shots highlight breathtaking views while close-up footage captures the details of the perfect getaway. Content that sells an experience — not just a room.',
    services: ['צילום דרון', 'וידאו תדמית', 'ניהול סושיאל', 'רילס'],
    servicesEn: ['Drone Photography', 'Brand Video', 'Social Management', 'Reels'],
    gallery: [
      '/posters/hotels/hotel drone shot.webp',
      '/posters/hotels/v14044g50000d1ma62vog65k1sjdbu90.webp',
      '/posters/hotels/v14044g50000d1pk9hfog65ji0k9nub0.webp',
      '/posters/hotels/v1c044g50000d2qrjgfog65q8kapaf30.webp',
    ],
    videos: [
      '/videos/hotels/VID_20260321_130726_487.mp4',
      '/videos/hotels/VID_20260321_130746_721.mp4',
      '/videos/hotels/VID_20260321_130914_326.mp4',
      '/videos/hotels/copy_5D2781DD-1C9B-4F48-8845-B3615FFD4A30.mp4',
      '/videos/hotels/copy_CEBE3CEA-EC9D-47D7-B191-094750BB9D9B.mp4',
      '/videos/hotels/storis-background.mp4',
      '/videos/hotels/brand-video-hotel.mp4',
    ],
  },
  {
    id: 'brands',
    paletteKey: 'brands',
    tags: 'מותגים • תוכן • אסטרטגיה',
    tagsEn: 'BRANDS • CONTENT • STRATEGY',
    title: 'פיתוח מותגים',
    titleEn: 'Growth Lab',
    coverAsset: '/posters/theme/brands.png',
    description:
      'ניהול מקיף של כל הפלטפורמות החברתיות שלכם — מאסטרטגיית תוכן, דרך הפקה מקורית (כולל וידאו וצילום אווירי), ועד לניהול קהילה וניתוח ביצועים. בניית מותג חזק, הגברת מעורבות והגדלת מכירות.',
    descriptionEn:
      'Full-service social media management across all platforms — from content strategy through original production (including video and drone) to community management and analytics. Build a strong brand, boost engagement, grow sales.',
    services: ['אסטרטגיה דיגיטלית', 'ניהול סושיאל מדיה', 'הפקת תוכן', 'ברנדינג'],
    servicesEn: ['Digital Strategy', 'Social Media Management', 'Content Production', 'Branding'],
    gallery: [
      '/posters/brands/streets.webp',
      '/posters/brands/mahlevet evri.webp',
      '/posters/brands/agalt-cafe.webp',
      '/posters/brands/ugc-B.webp',
    ],
    videos: [],
  },
]

// ─── Main section ─────────────────────────────────────────────────────────────
const WorkGrid = () => {
  const { language } = useI18n()
  const isRTL = language === 'he'
  const [selected, setSelected] = useState<WorkItem | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const titleInView = useInView(sectionRef, { once: true, margin: '-80px' })

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleWhatsApp = () => {
    window.open('https://wa.me/message/D4AOECDSG35YE1', '_blank')
  }

  return (
    <>
      <motion.section
        ref={sectionRef}
        id="work"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{
          background: 'var(--color-cream)',
          padding: `0 var(--base-padding-x) clamp(80px, 10vw, 140px)`,
          position: 'relative',
        }}
      >
        {/* ── Divider line ── */}
        <div style={{ overflow: 'hidden', marginBottom: 'clamp(50px, 6vw, 80px)' }}>
          <motion.div
            initial={{ scaleX: 0, transformOrigin: isRTL ? 'right' : 'left' }}
            animate={titleInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.1, ease: EASE }}
            style={{ height: 1, background: 'rgba(26,24,20,0.14)', width: '100%' }}
          />
        </div>

        {/* ── Section counter + header ── */}
        <div style={{ marginBottom: 'clamp(48px, 5vw, 72px)' }}>
          {/* Orange index label */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={titleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: 'var(--color-orange)',
              marginBottom: '1rem',
            }}
          >
            — 01 / WORK
          </motion.p>

          {/* Title row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '2rem',
              flexWrap: isMobile ? 'wrap' : 'nowrap',
            }}
          >
            {/* Word-by-word title reveal */}
            <h2 style={{
              fontFamily: isRTL ? 'var(--font-display)' : 'var(--font-display-en-hero)',
              fontWeight: isRTL ? 900 : 400,
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              lineHeight: 0.9,
              letterSpacing: isRTL ? '-0.02em' : '-0.01em',
              color: 'var(--color-ink)',
              margin: 0,
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0 0.22em',
              flex: 1,
            }}>
              {(isRTL ? 'עבודות נבחרות' : 'Featured Work').split(' ').map((word, i) => (
                <span key={i} style={{ display: 'inline-block', overflow: 'hidden' }}>
                  <motion.span
                    style={{ display: 'inline-block' }}
                    initial={{ y: '110%' }}
                    animate={titleInView ? { y: 0 } : {}}
                    transition={{ duration: 0.9, delay: i * 0.13, ease: EASE }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
              {/* Orange underline */}
              <span style={{ display: 'block', width: '100%', height: '3px', background: 'var(--color-orange)', borderRadius: '9999px', marginTop: '0.2em' }} />
            </h2>

            {/* Disclaimer */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={titleInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--color-ink-muted)',
                maxWidth: isMobile ? '100%' : '24ch',
                lineHeight: 1.65,
                textAlign: isRTL ? 'right' : 'left',
                paddingBottom: '0.3em',
                flexShrink: 0,
              }}
            >
              {isRTL
                ? 'מבחר עבודות שנוצרו עם מותגים ועסקים שאנחנו אוהבים'
                : 'A selection of passionately crafted works with brands we love'}
            </motion.p>
          </div>
        </div>

        {/* ── 6-card grid ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '1.5rem' : '2vw',
          }}
        >
          {WORK_ITEMS.map((item, i) => (
            <WorkCard
              key={item.id}
              item={item}
              index={i}
              isRTL={isRTL}
              language={language}
              isMobile={isMobile}
              onClick={() => setSelected(item)}
            />
          ))}
        </div>
      </motion.section>

      {/* ── Detail overlay ── */}
      <AnimatePresence>
        {selected && (
          <DetailView
            item={selected}
            isRTL={isRTL}
            language={language}
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
  item: WorkItem
  index: number
  isRTL: boolean
  language: string
  isMobile: boolean
  onClick: () => void
}

const WorkCard = ({ item, index, isRTL, language, isMobile, onClick }: WorkCardProps) => {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: true, margin: '-20px' })
  const palette = PALETTES[item.paletteKey]

  // Row-pair stagger: cards 0&1 together, 2&3 together, 4&5 together
  const pairDelay = isMobile ? index * 0.08 : (index % 2) * 0.18

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: isMobile ? 20 : 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: isMobile ? 0.5 : 1.0, delay: pairDelay, ease: EASE }}
      style={{ marginTop: !isMobile && index >= 2 ? '5em' : 0 }}
    >
      {/* Image */}
      <motion.div
        layoutId={`card-img-${item.id}`}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={onClick}
        style={{
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          cursor: 'pointer',
          paddingTop: '65%',
          background: 'var(--color-cream-dark)',
        }}
      >
        <img
          src={item.coverAsset}
          alt={language === 'he' ? item.title : item.titleEn}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: item.coverPosition ?? 'center',
            transition: 'transform 0.65s cubic-bezier(0.35,0,0,1)',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        {item.coverOverlay && (
          <div style={{ position: 'absolute', inset: 0, background: item.coverOverlay, mixBlendMode: 'multiply' }} />
        )}

        {/* Lusion-style bottom overlay — slides up on hover */}
        <motion.div
          animate={{ y: hovered ? '0%' : '100%' }}
          transition={{ duration: 0.55, ease: EASE }}
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, ${palette.bg}ee 0%, ${palette.bg}88 55%, transparent 100%)`,
            display: 'flex',
            alignItems: 'flex-end',
            padding: '1.5rem',
            pointerEvents: 'none',
          }}
        >
          {/* Arrow pill inside overlay */}
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: palette.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={palette.accentText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={isRTL ? 'M19 12H5M12 19l-7-7 7-7' : 'M5 12h14M12 5l7 7-7 7'} />
            </svg>
          </div>
        </motion.div>

        {/* Niche accent dot — top corner */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            insetInlineEnd: '1rem',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: palette.accent,
            opacity: 0.9,
          }}
        />
      </motion.div>

      {/* Card text */}
      <div style={{ paddingTop: '1rem' }}>
        {/* Tags with orange dots */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(0.58rem, 0.82vw, 0.72rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-ink-muted)',
            margin: '0 0 0.45rem',
          }}
        >
          <span style={{ color: 'var(--color-orange)', marginInlineEnd: '0.4em' }}>◆</span>
          {language === 'he' ? item.tags : item.tagsEn}
        </p>
        <motion.h3
          animate={{ x: hovered ? (isRTL ? -8 : 8) : 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          onClick={onClick}
          style={{
            fontFamily: isRTL ? 'var(--font-display)' : 'var(--font-display-en)',
            fontWeight: isRTL ? 700 : 600,
            fontSize: 'clamp(1.6rem, 3vw, 3rem)',
            letterSpacing: isRTL ? '-0.01em' : '-0.03em',
            color: 'var(--color-ink)',
            margin: 0,
            cursor: 'pointer',
          }}
        >
          {language === 'he' ? item.title : item.titleEn}
        </motion.h3>
      </div>
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

// ─── Detail view ──────────────────────────────────────────────────────────────
interface DetailViewProps {
  item: WorkItem
  isRTL: boolean
  language: string
  onClose: () => void
  onWhatsApp: () => void
}

const DetailView = ({ item, isRTL, language, onClose, onWhatsApp }: DetailViewProps) => {
  const p = PALETTES[item.paletteKey]
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const videos = (VIDEO_MANIFEST[item.id]?.length ? VIDEO_MANIFEST[item.id] : null) ?? item.videos ?? []
  const hasVideos = videos.length > 0
  const galleryItems = item.gallery.slice(1)

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.72, ease: EASE }}
      dir={isRTL ? 'rtl' : 'ltr'}
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
            <path d={isRTL ? 'M5 12h14M12 5l7 7-7 7' : 'M19 12H5M12 5l-7 7 7 7'} />
          </svg>
          {isRTL ? 'חזרה' : 'Back'}
        </button>
        <span style={{
          pointerEvents: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.7)',
        }}>
          {language === 'he' ? item.tags : item.tagsEn}
        </span>
      </nav>

      {/* ── Full-bleed 100vh hero ── */}
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <motion.div
          layoutId={`card-img-${item.id}`}
          style={{ position: 'absolute', inset: 0 }}
        >
          <img
            src={item.coverAsset}
            alt={language === 'he' ? item.title : item.titleEn}
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
                fontFamily: isRTL ? 'var(--font-display)' : 'var(--font-display-en)',
                fontWeight: isRTL ? 700 : 600,
                fontSize: 'clamp(3.5rem, 9vw, 10rem)',
                lineHeight: 0.88,
                letterSpacing: isRTL ? '-0.02em' : '-0.04em',
                color: '#fff',
                margin: 0,
              }}
            >
              {language === 'he' ? item.title : item.titleEn}
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
              transformOrigin: isRTL ? 'right' : 'left',
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
            {isRTL ? 'גלול' : 'scroll'}
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
            {language === 'he' ? item.description : item.descriptionEn}
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
              {isRTL ? 'שירותים' : 'SERVICES'}
            </p>
            {(language === 'he' ? item.services : item.servicesEn).map((s, i) => (
              <motion.p
                key={s}
                initial={{ opacity: 0, x: isRTL ? 14 : -14 }}
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
                <span style={{ color: p.accent, fontSize: '0.45rem' }}>◆</span>
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
              {isRTL ? 'בואו נעבוד יחד' : "Let's work together"}
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
                {isRTL ? 'עבודות' : 'Work'}
              </p>
              <div style={{ height: 1, flex: 1, background: p.divider }} />
            </div>

            <div style={{
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
                  <video
                    src={src}
                    muted
                    loop
                    playsInline
                    autoPlay
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
    </motion.div>
  )
}

export default WorkGrid
