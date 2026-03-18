import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useI18n } from '@/i18n/simple'

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
  description: string
  descriptionEn: string
  services: string[]
  servicesEn: string[]
  gallery: string[]
}

const WORK_ITEMS: WorkItem[] = [
  {
    id: 'weddings',
    paletteKey: 'weddings',
    tags: 'חתונות • וידאו • רגעים',
    tagsEn: 'WEDDINGS • VIDEO • MOMENTS',
    title: 'חתונות',
    titleEn: 'Weddings',
    coverAsset: '/posters/weddings/חתונה-W.webp',
    description:
      'תיעוד אותנטי של הרגעים הכי חשובים. כל חתונה היא סיפור ייחודי שמחכה להיספר — ואנחנו כאן כדי לספר אותו בדרך שתישאר לנצח.',
    descriptionEn:
      'Authentic documentation of the most important moments. Every wedding is a unique story waiting to be told — we are here to tell it in a way that lasts forever.',
    services: ['וידאו חתונות', 'רילס ותוכן', 'אינסטגרם סטוריז', 'עריכה'],
    servicesEn: ['Wedding Video', 'Reels & Content', 'Instagram Stories', 'Editing'],
    gallery: [
      '/posters/weddings/חתונה-W.webp',
      '/posters/weddings/מסיבת אירוסין-W.webp',
      '/posters/weddings/סושיאל חתונה.webp',
      '/posters/weddings/proposel.webp',
      '/posters/weddings/copy_4CB7BB16-8667-4394-9EFC-4820095F619E.webp',
    ],
  },
  {
    id: 'restaurants',
    paletteKey: 'restaurants',
    tags: 'מסעדות • אוכל • תדמית',
    tagsEn: 'RESTAURANTS • FOOD • BRANDING',
    title: 'מסעדות',
    titleEn: 'Restaurants',
    coverAsset: '/posters/brands/סרטון תדמית מסעדה-B.webp',
    description:
      'תוכן ויזואלי שמעורר תיאבון ומביא לקוחות לדלת. ווידאו שמספר את הסיפור של המסעדה — את האווירה, הטעם והנשמה.',
    descriptionEn:
      'Visual content that stimulates appetite and brings customers to the door. Video that tells the story of the restaurant — the atmosphere, the flavor, the soul.',
    services: ['הפקת וידאו תדמית', 'צילום מוצר', 'סטוריז ורילס', 'UGC'],
    servicesEn: ['Brand Video Production', 'Product Photography', 'Stories & Reels', 'UGC'],
    gallery: [
      '/posters/brands/סרטון תדמית מסעדה-B.webp',
      '/posters/brands/agalt-cafe.webp',
      '/posters/brands/streets.webp',
    ],
  },
  {
    id: 'social',
    paletteKey: 'social',
    tags: 'סושיאל • UGC • תוכן',
    tagsEn: 'SOCIAL • UGC • CONTENT',
    title: 'שוטים סושיאל',
    titleEn: 'Social Shoots',
    coverAsset: '/posters/brands/ugc-B.webp',
    description:
      'שוטים סושיאל שמייצרים באזז ומניעים פעולה. תוכן UGC אותנטי לטיקטוק ורילס שמדבר ישירות לקהל היעד.',
    descriptionEn:
      'Social shoots that generate buzz and drive action. Authentic UGC content for TikTok and Reels that speaks directly to your target audience.',
    services: ['תוכן UGC', 'רילס וטיקטוק', 'ניהול קמפיינים', 'אסטרטגיה'],
    servicesEn: ['UGC Content', 'Reels & TikTok', 'Campaign Management', 'Strategy'],
    gallery: [
      '/posters/brands/ugc-B.webp',
      '/posters/brands/mahlevet evri.webp',
      '/posters/brands/agalt-cafe.webp',
    ],
  },
  {
    id: 'savethedate',
    paletteKey: 'savethedate',
    tags: 'סייב דה דייט • הצעה • אירוסין',
    tagsEn: 'SAVE THE DATE • PROPOSAL • ENGAGEMENT',
    title: 'סייב דה דייט',
    titleEn: 'Save the Date',
    coverAsset: '/posters/weddings/proposel.webp',
    description:
      'הרגע שמכריז על האהבה — מצולם בצורה שתספר את הסיפור שלכם. סרטוני הצעת נישואין ואירוסין שנשארים לנצח.',
    descriptionEn:
      'The moment that announces love — filmed in a way that tells your story. Proposal and engagement videos that last forever.',
    services: ['סרטוני הצעה', 'אירוסין', 'סייב דה דייט', 'רגעים'],
    servicesEn: ['Proposal Videos', 'Engagement', 'Save the Date', 'Moments'],
    gallery: [
      '/posters/weddings/proposel.webp',
      '/posters/weddings/מסיבת אירוסין-W.webp',
      '/posters/weddings/סושיאל חתונה.webp',
    ],
  },
  {
    id: 'hotels',
    paletteKey: 'hotels',
    tags: 'מלונות • חופשות • דרון',
    tagsEn: 'HOTELS • VACATIONS • DRONE',
    title: 'חופשות ומלונות',
    titleEn: 'Vacations & Hotels',
    coverAsset: '/posters/hotels/hotel drone shot.webp',
    description:
      'צילום דרון וסרטוני תדמית למלונות ואתרי נופש. תוכן שמראה את הניסיון, לא רק את החדר — ומביא אורחים שמחפשים בדיוק את מה שאתם מציעים.',
    descriptionEn:
      'Drone footage and brand videos for hotels and resorts. Content that shows the experience, not just the room — attracting guests looking for exactly what you offer.',
    services: ['צילום דרון', 'וידאו תדמית', 'ניהול סושיאל', 'רילס'],
    servicesEn: ['Drone Photography', 'Brand Video', 'Social Management', 'Reels'],
    gallery: [
      '/posters/hotels/hotel drone shot.webp',
      '/posters/hotels/v14044g50000d1ma62vog65k1sjdbu90.webp',
      '/posters/hotels/v14044g50000d1pk9hfog65ji0k9nub0.webp',
      '/posters/hotels/v1c044g50000d2qrjgfog65q8kapaf30.webp',
    ],
  },
  {
    id: 'brands',
    paletteKey: 'brands',
    tags: 'מותגים • תוכן • אסטרטגיה',
    tagsEn: 'BRANDS • CONTENT • STRATEGY',
    title: 'מותגים ותוכן',
    titleEn: 'Brands & Content',
    coverAsset: '/posters/brands/streets.webp',
    description:
      'בניית נוכחות מותגית חזקה ברשתות החברתיות. מאסטרטגיה ועד הפקה — כל מותג מקבל את הקול הייחודי שלו.',
    descriptionEn:
      'Building a strong brand presence on social media. From strategy to production — every brand gets its unique voice.',
    services: ['אסטרטגיה דיגיטלית', 'ניהול סושיאל מדיה', 'הפקת תוכן', 'ברנדינג'],
    servicesEn: ['Digital Strategy', 'Social Media Management', 'Content Production', 'Branding'],
    gallery: [
      '/posters/brands/streets.webp',
      '/posters/brands/mahlevet evri.webp',
      '/posters/brands/agalt-cafe.webp',
      '/posters/brands/ugc-B.webp',
    ],
  },
]

// ─── Main section ─────────────────────────────────────────────────────────────
const WorkGrid = () => {
  const { language } = useI18n()
  const isRTL = language === 'he'
  const [selected, setSelected] = useState<WorkItem | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const titleInView = useInView(sectionRef, { once: true, margin: '-80px' })

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
            }}
          >
            {/* Masked title */}
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <motion.h2
                initial={{ y: '110%' }}
                animate={titleInView ? { y: 0 } : {}}
                transition={{ duration: 0.9, ease: EASE }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: 'clamp(3rem, 8vw, 8rem)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-ink)',
                  margin: 0,
                  // Orange underline accent
                  borderBottom: '3px solid var(--color-orange)',
                  paddingBottom: '0.15em',
                  display: 'inline-block',
                }}
              >
                {isRTL ? 'עבודות נבחרות' : 'Featured Work'}
              </motion.h2>
            </div>

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
                maxWidth: '24ch',
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
            gridTemplateColumns: '1fr 1fr',
            gap: '2vw',
          }}
        >
          {WORK_ITEMS.map((item, i) => (
            <WorkCard
              key={item.id}
              item={item}
              index={i}
              isRTL={isRTL}
              language={language}
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
  onClick: () => void
}

const WorkCard = ({ item, index, isRTL, language, onClick }: WorkCardProps) => {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const inView = useInView(cardRef, { once: true, margin: '-60px' })
  const palette = PALETTES[item.paletteKey]

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay: (index % 2) * 0.14, ease: EASE }}
      style={{ marginTop: index >= 2 ? '5em' : 0 }}
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
            transition: 'transform 0.65s cubic-bezier(0.35,0,0,1)',
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
          }}
        />

        {/* Niche color wash on hover */}
        <motion.div
          animate={{ opacity: hovered ? 0.18 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            position: 'absolute',
            inset: 0,
            background: palette.accent,
            pointerEvents: 'none',
          }}
        />

        {/* Arrow pill */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : isRTL ? 16 : -16 }}
          transition={{ duration: 0.28, ease: EASE }}
          style={{
            position: 'absolute',
            bottom: '1.25rem',
            insetInlineStart: '1.25rem',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--color-orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={isRTL ? 'M19 12H5M12 19l-7-7 7-7' : 'M5 12h14M12 5l7 7-7 7'} />
          </svg>
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
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 'clamp(1.6rem, 3vw, 3rem)',
            letterSpacing: '-0.01em',
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: p.bg,
        overflowY: 'auto',
        // Smooth palette transition
        transition: 'background 0.6s cubic-bezier(0.35,0,0,1)',
      }}
    >
      {/* Sticky nav */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          padding: '1.4rem var(--base-padding-x)',
          background: p.bg,
          borderBottom: `1px solid ${p.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={onClose}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: `${p.accent}18`,
            border: `1px solid ${p.accent}40`,
            color: p.heading,
            borderRadius: '9999px',
            padding: '0.5rem 1.4rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = `${p.accent}28`)}
          onMouseLeave={e => (e.currentTarget.style.background = `${p.accent}18`)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d={isRTL ? 'M5 12h14M12 5l7 7-7 7' : 'M19 12H5M12 5l-7 7 7 7'} />
          </svg>
          {isRTL ? '← חזרה' : '← Back'}
        </button>

        {/* Accent tag */}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: p.accent,
          }}
        >
          {language === 'he' ? item.tags : item.tagsEn}
        </span>
      </nav>

      {/* Body */}
      <div style={{ padding: '5vh var(--base-padding-x) clamp(60px, 8vw, 100px)' }}>
        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4vw',
            alignItems: 'start',
            marginBottom: '6vh',
          }}
        >
          {/* Left */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 'clamp(2.5rem, 5vw, 5.5rem)',
                letterSpacing: '-0.02em',
                lineHeight: 0.95,
                color: p.heading,
                margin: '0 0 0.4em',
              }}
            >
              {language === 'he' ? item.title : item.titleEn}
            </motion.h2>

            {/* Orange accent line */}
            <div
              style={{
                width: '3rem',
                height: 3,
                background: p.accent,
                borderRadius: 99,
                marginBottom: '1.8rem',
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.75,
                color: p.body,
                maxWidth: '42ch',
                marginBottom: '2.5rem',
              }}
            >
              {language === 'he' ? item.description : item.descriptionEn}
            </motion.p>

            {/* Services */}
            <div style={{ marginBottom: '2.5rem' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: p.accent,
                  marginBottom: '0.8rem',
                }}
              >
                {isRTL ? 'שירותים' : 'SERVICES'}
              </p>
              {(language === 'he' ? item.services : item.servicesEn).map((s, i) => (
                <motion.p
                  key={s}
                  initial={{ opacity: 0, x: isRTL ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07, ease: EASE }}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.05rem',
                    color: p.heading,
                    margin: '0.3rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ color: p.accent, fontSize: '0.5rem' }}>◆</span>
                  {s}
                </motion.p>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
              onClick={onWhatsApp}
              style={{
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

          {/* Right: shared-element cover */}
          <motion.div
            layoutId={`card-img-${item.id}`}
            style={{ borderRadius: 20, overflow: 'hidden', aspectRatio: '4/3' }}
          >
            <img
              src={item.coverAsset}
              alt={language === 'he' ? item.title : item.titleEn}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        </div>

        {/* Horizontal gallery */}
        {item.gallery.length > 1 && (
          <div>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: p.muted,
                marginBottom: '1.2rem',
              }}
            >
              {isRTL ? '← גלריה' : 'Gallery →'}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1.5rem',
                overflowX: 'auto',
                paddingBottom: '1rem',
                scrollbarWidth: 'thin',
                scrollbarColor: `${p.scrollbar} transparent`,
              }}
            >
              {item.gallery.map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
                  style={{
                    flexShrink: 0,
                    width: 'clamp(220px, 32vw, 460px)',
                    aspectRatio: '4/3',
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: p.cardBg,
                    border: `1px solid ${p.divider}`,
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
    </motion.div>
  )
}

export default WorkGrid
