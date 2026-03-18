import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useI18n } from '@/i18n/simple'
import StoriesGalleryModal from './StoriesGalleryModal'

// TODO: swap /profile.webp for a background-removed PNG cutout for the floating effect
const HERO_IMAGE = '/profile.webp'

const WhatsAppIcon = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.309" />
  </svg>
)

// ── Sub-components ───────────────────────────────────────────────────────────

interface HeroTextProps {
  language: string
  chips: string[]
  onWhatsApp: () => void
}

const HeroText = ({ language, chips, onWhatsApp }: HeroTextProps) => (
  <div>
    <p style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
      textTransform: 'uppercase', letterSpacing: '0.15em',
      color: 'var(--color-ink)', marginBottom: '1.25rem',
    }}>
      {language === 'he' ? 'ניהול סושיאל מדיה • תוכן וידאו' : 'SOCIAL MEDIA MANAGEMENT • VIDEO CONTENT'}
    </p>

    <h1 style={{
      fontFamily: 'var(--font-body)', fontWeight: 700,
      fontSize: 'clamp(2.8rem, 6vw, 6rem)', lineHeight: 1,
      letterSpacing: '-0.02em', margin: '0 0 1.25rem',
    }}>
      <span style={{ color: 'var(--color-orange)' }}>
        {language === 'he' ? 'סושיאל + וידאו' : 'Social + Video'}
      </span>
      <br />
      <span style={{ color: 'var(--color-ink)' }}>
        {language === 'he' ? 'שמביא תוצאות' : 'that drives results'}
      </span>
    </h1>

    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '1rem',
      color: 'var(--color-ink-muted)', marginBottom: '2rem',
    }}>
      {language === 'he'
        ? 'טיקטוק/רילס שמייצרים באזז ופניות. הפקה + ניהול + שיפור.'
        : 'TikTok/Reels that create buzz and inquiries. Production + management + iteration.'}
    </p>

    <button onClick={onWhatsApp} style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      background: 'var(--color-orange)', color: 'white', border: 'none',
      borderRadius: '9999px', padding: '0.75rem 2rem',
      fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 500,
      cursor: 'pointer', marginBottom: '1.25rem',
    }}>
      <WhatsAppIcon />
      {language === 'he' ? 'בואו נתחיל לעבוד יחד' : "Let's work together"}
    </button>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {chips.map((chip) => (
        <span key={chip} style={{
          background: 'rgba(26,24,20,0.06)', border: '1px solid rgba(26,24,20,0.12)',
          color: 'var(--color-ink)', borderRadius: '9999px',
          padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontFamily: 'var(--font-body)',
        }}>{chip}</span>
      ))}
    </div>
  </div>
)

interface AboutTextProps {
  language: string
  tags: string[]
  onGallery: () => void
}

const AboutText = ({ language, tags, onGallery }: AboutTextProps) => (
  <div>
    <p style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase',
      letterSpacing: '0.15em', color: 'var(--color-orange)', marginBottom: '1.25rem',
    }}>
      {language === 'he' ? 'אודות' : 'ABOUT'}
    </p>

    <h2 style={{
      fontFamily: 'var(--font-body)', fontWeight: 700,
      fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.05,
      letterSpacing: '-0.02em', color: 'var(--color-ink)', margin: '0 0 1.25rem',
    }}>
      {language === 'he' ? 'קצת עליי' : 'About Me'}
    </h2>

    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.7,
      color: 'var(--color-ink-muted)', marginBottom: '1rem',
    }}>
      {language === 'he'
        ? 'אני שני, יוצרת תוכן ומנהלת סושיאל מדיה. אני מאמינה שכל מותג יש לו סיפור ייחודי שמחכה להיספר. המומחיות שלי היא ליצור תוכן וידאו אותנטי שמתחבר לקהל ומניע פעולה.'
        : "I'm Shani, a content creator and social media manager. I believe every brand has a unique story waiting to be told. My expertise is creating authentic video content that connects with audiences and drives action."}
    </p>

    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.7,
      color: 'var(--color-ink-muted)', marginBottom: '1.5rem',
    }}>
      {language === 'he'
        ? 'המטרה שלי היא לעזור לעסקים לבנות נוכחות חזקה ברשתות החברתיות דרך סיפורים אמיתיים ותוכן שמדבר אל הלב.'
        : 'My goal is to help businesses build a strong social media presence through authentic stories and content that speaks to the heart.'}
    </p>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
      {tags.map((tag) => (
        <span key={tag} style={{
          background: 'var(--color-cream-dark)', border: '1px solid rgba(26,24,20,0.12)',
          color: 'var(--color-ink)', borderRadius: '9999px',
          padding: '0.3rem 0.85rem', fontSize: '0.85rem', fontFamily: 'var(--font-body)',
        }}>{tag}</span>
      ))}
    </div>

    <button onClick={onGallery} style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      background: 'transparent', color: 'var(--color-orange)',
      border: '2px solid var(--color-orange)',
      borderRadius: '9999px', padding: '0.75rem 2rem',
      fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 500,
      cursor: 'pointer',
    }}>
      {language === 'he' ? 'צפו בגלריית הסטוריז' : 'View Stories Gallery'}
    </button>
  </div>
)

// ── Nav ──────────────────────────────────────────────────────────────────────

interface NavProps {
  language: string
  setLanguage: (l: 'he' | 'en') => void
}

const Nav = ({ language, setLanguage }: NavProps) => (
  <nav style={{
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.5rem var(--base-padding-x)',
  }}>
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {(['he', 'en'] as const).map((lang) => (
        <button key={lang} onClick={() => setLanguage(lang)} style={{
          padding: '0.25rem 0.75rem', borderRadius: '9999px', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
          background: language === lang ? 'var(--color-ink)' : 'rgba(26,24,20,0.08)',
          color: language === lang ? 'white' : 'var(--color-ink)', transition: 'all 0.2s',
        }}>
          {lang === 'he' ? 'עב' : 'EN'}
        </button>
      ))}
    </div>
    <img src="/shani-logo2.webp" alt="Shani Social Media" style={{ height: '3.5rem' }} />
  </nav>
)

// ── Main component ───────────────────────────────────────────────────────────

const HeroAbout = () => {
  const { language, setLanguage } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const isRTL = language === 'he'

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Image: starts RIGHT side in Hero (small), grows larger as About arrives
  const imageScale = useTransform(scrollYProgress, [0, 0.35, 0.78], [0.65, 0.67, 1.0])
  const imageXLTR = useTransform(scrollYProgress, [0, 0.35, 0.78], ['22vw', '22vw', '20vw'])
  const imageXRTL = useTransform(scrollYProgress, [0, 0.35, 0.78], ['-22vw', '-22vw', '-20vw'])
  const imageY = useTransform(scrollYProgress, [0, 0.35, 0.78], ['2vh', '2vh', '0vh'])

  // Hero text: fades out as you scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22, 0.42], [1, 1, 0])
  const heroY = useTransform(scrollYProgress, [0.22, 0.42], ['0px', '-14px'])

  // About text: fades in after hero text is gone
  const aboutOpacity = useTransform(scrollYProgress, [0.54, 0.78], [0, 1])
  const aboutYMotion = useTransform(scrollYProgress, [0.54, 0.78], ['14px', '0px'])

  const imageX = isRTL ? imageXRTL : imageXLTR

  const chips = language === 'he'
    ? ['7+ מיליון צפיות', '40%+ עליה בפניות', 'מותגים מקומיים סומכים']
    : ['7+M views', '40%+ lift in inquiries', 'Trusted by local brands']

  const tags = language === 'he'
    ? ['תוכן UGC', 'סרטוני טיקטוק', 'רילס אינסטגרם', 'אירועים']
    : ['UGC Content', 'TikTok Videos', 'Instagram Reels', 'Events']

  const handleWhatsApp = () => window.open('https://wa.me/message/D4AOECDSG35YE1', '_blank')

  const textSideStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: isRTL ? 'auto' : 'var(--base-padding-x)',
    right: isRTL ? 'var(--base-padding-x)' : 'auto',
    maxWidth: '42%',
    zIndex: 10,
  }

  return (
    <>
      {/* ── Desktop: cinematic scroll section ── */}
      <div
        ref={sectionRef}
        id="about"
        dir={isRTL ? 'rtl' : 'ltr'}
        className="hidden md:block"
        style={{ minHeight: '260vh', position: 'relative' }}
      >
        <div style={{
          position: 'sticky', top: 0, height: '100vh',
          overflow: 'hidden', background: 'var(--color-cream)',
        }}>
          {/* Background texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(90deg, var(--color-line) 0px, var(--color-line) 1px, transparent 1px, transparent 80px)',
          }} />

          <Nav language={language} setLanguage={setLanguage} />

          {/* THE shared image — centered, then drifts to About side on scroll */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)', zIndex: 2,
          }}>
            <motion.div style={{
              x: imageX, y: imageY, scale: imageScale,
              width: 'clamp(300px, 34vw, 460px)', height: '72vh',
              borderRadius: 20, overflow: 'hidden', willChange: 'transform',
              boxShadow: '0 32px 80px rgba(26,24,20,0.18)',
            }}>
              <img
                src={HERO_IMAGE}
                alt="Shani"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </motion.div>
          </div>

          {/* Hero text — fades out */}
          <motion.div style={{ ...textSideStyle, translateY: '-50%', opacity: heroOpacity, y: heroY }}>
            <HeroText language={language} chips={chips} onWhatsApp={handleWhatsApp} />
          </motion.div>

          {/* About text — fades in */}
          <motion.div style={{ ...textSideStyle, translateY: '-50%', opacity: aboutOpacity, y: aboutYMotion }}>
            <AboutText language={language} tags={tags} onGallery={() => setGalleryOpen(true)} />
          </motion.div>
        </div>
      </div>

      {/* ── Mobile: static stacked layout ── */}
      <div dir={isRTL ? 'rtl' : 'ltr'} className="md:hidden">
        {/* Mobile Hero */}
        <section style={{
          minHeight: '100vh', background: 'var(--color-cream)', position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', paddingTop: '6rem',
          paddingInline: 'var(--base-padding-x)', textAlign: 'center', gap: '1.5rem',
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(90deg, var(--color-line) 0px, var(--color-line) 1px, transparent 1px, transparent 80px)',
          }} />
          <Nav language={language} setLanguage={setLanguage} />

          <img src={HERO_IMAGE} alt="Shani" style={{
            width: 'clamp(220px, 70vw, 320px)', height: 'auto', aspectRatio: '3/4',
            objectFit: 'cover', borderRadius: 20, position: 'relative', zIndex: 1,
            boxShadow: '0 24px 60px rgba(26,24,20,0.15)',
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 360 }}>
            <HeroText language={language} chips={chips} onWhatsApp={handleWhatsApp} />
          </div>
        </section>

        {/* Mobile About */}
        <section id="about" style={{
          background: 'var(--color-cream)', padding: '4rem var(--base-padding-x)',
          borderTop: '1px solid var(--color-line)',
        }}>
          <AboutText language={language} tags={tags} onGallery={() => setGalleryOpen(true)} />
        </section>
      </div>

      <StoriesGalleryModal isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} />
    </>
  )
}

export default HeroAbout
