import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useI18n } from '@/i18n/simple'
import StoriesGalleryModal from './StoriesGalleryModal'

const HERO_IMAGE_1 = '/profile1-styled.png'
const HERO_IMAGE_2 = '/profile2-styled.png'

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

const HeroText = ({ language, chips, onWhatsApp }: HeroTextProps) => {
  const isRTL = language === 'he';
  return (
    <div>
    <p style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.7rem',
      textTransform: 'uppercase', letterSpacing: '0.15em',
      color: 'var(--color-ink)', marginBottom: '1.25rem',
    }}>
      {language === 'he' ? 'צילום • ניהול סושיאל • אירועים' : 'SHOOTS • SOCIAL MEDIA • EVENTS'}
    </p>

    <h1 style={{ margin: '0 0 1.25rem', lineHeight: 1 }}>
      <span style={{
        display: 'block',
        fontFamily: isRTL ? 'var(--font-display)' : 'var(--font-display-en-hero)',
        fontWeight: isRTL ? 900 : 400,
        fontSize: 'clamp(3.2rem, 7vw, 7rem)',
        letterSpacing: isRTL ? '-0.02em' : '-0.01em',
        color: 'var(--color-orange)',
        lineHeight: 1,
      }}>
        {language === 'he' ? 'יוצרת נוכחות.' : 'Creating presence.'}
      </span>
      <span style={{
        display: 'block',
        fontFamily: isRTL ? 'var(--font-display)' : 'var(--font-display-en-hero)',
        fontWeight: isRTL ? 900 : 400,
        fontSize: 'clamp(1.9rem, 4vw, 4rem)',
        letterSpacing: isRTL ? '-0.01em' : '-0.01em',
        color: 'var(--color-ink)',
        lineHeight: 1.15,
        marginTop: '0.35em',
        opacity: 0.85,
      }}>
        {language === 'he' ? 'מצלמת רגעים. בונה מותגים.' : 'Capturing moments. Building brands.'}
      </span>
    </h1>

    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '1rem',
      color: 'var(--color-ink-muted)', marginBottom: '2rem',
    }}>
      {language === 'he'
        ? 'ניהול סושיאל וצילום רילס/טיקטוק בסטנדרט של קולנוע. הופכת Buzz למכירות.'
        : 'Social media management + cinematic Reels/TikTok. Turning Buzz into sales.'}
    </p>

    <button onClick={onWhatsApp} style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      background: 'var(--color-orange)', color: 'white', border: 'none',
      borderRadius: '9999px', padding: '0.75rem 2rem',
      fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 500,
      cursor: 'pointer', marginBottom: '1.25rem',
    }}>
      <WhatsAppIcon />
      {language === 'he' ? 'בואו ניצור buzz' : "Let's create buzz"}
    </button>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'inherit' }}>
      {chips.map((chip) => (
        <span key={chip} style={{
          background: 'rgba(26,24,20,0.06)', border: '1px solid rgba(26,24,20,0.12)',
          color: 'var(--color-ink)', borderRadius: '9999px',
          padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontFamily: 'var(--font-body)',
        }}>{chip}</span>
      ))}
    </div>
    </div>
  );
}

interface AboutTextProps {
  language: string
  tags: string[]
  onGallery: () => void
}

const AboutText = ({ language, tags, onGallery }: AboutTextProps) => {
  const isRTL = language === 'he';
  return (
    <div>
    <p style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase',
      letterSpacing: '0.15em', color: 'var(--color-orange)', marginBottom: '1.25rem',
    }}>
      {language === 'he' ? 'אודות' : 'ABOUT'}
    </p>

    <h2 style={{
      fontFamily: isRTL ? 'var(--font-display)' : 'var(--font-display-en-hero)',
      fontWeight: isRTL ? 900 : 400,
      fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', lineHeight: 0.95,
      letterSpacing: isRTL ? '-0.02em' : '-0.01em', color: 'var(--color-ink)', margin: '0 0 1.5rem',
    }}>
      {language === 'he' ? 'היי, אני שני.' : "Hi, I'm Shani."}
    </h2>

    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.75,
      color: 'var(--color-ink)', marginBottom: '1rem', fontWeight: 500,
    }}>
      {language === 'he'
        ? 'מאז גיל צעיר התאהבתי בצילום, עריכה וכל מה שיש לו אסתטיקה. תמיד ידעתי שאני רוצה ליצור דברים שנראים טוב — שכל פרט קטן יהיה מכוון ומושלם.'
        : 'From a young age I fell in love with photography, editing and everything aesthetic. I always knew I wanted to create things that look beautiful — where every small detail is intentional and perfect.'}
    </p>

    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.75,
      color: 'var(--color-ink-muted)', marginBottom: '0.75rem',
    }}>
      {language === 'he'
        ? 'היום אני מביאה את האהבה הזו לכל פרויקט — מחתונות ואירועים מרגשים, דרך ימי צילום לעסקים, ועד לניהול סושיאל שוטף שבונה נוכחות אמיתית ברשת.'
        : 'Today I bring that love to every project — from weddings and emotional events, through business shoot days, to ongoing social media management that builds a real presence online.'}
    </p>

    <p style={{
      fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.75,
      color: 'var(--color-ink-muted)', marginBottom: '1.5rem',
    }}>
      {language === 'he'
        ? 'בשבילי כל פרט קטן חשוב. אני לא מוסרת עבודה שאני לא מאה אחוז מרוצה ממנה — כי בסוף זה הסיפור שלכם, ואני רוצה שהוא יהיה מושלם.'
        : "For me every small detail matters. I don't deliver work I'm not a hundred percent proud of — because at the end of the day, it's your story, and I want it to be perfect."}
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
  );
}

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
    <img src="/shani-logo2.webp" alt="Shani Social Media" style={{ height: '4.8rem' }} />
  </nav>
)

// ── Main component ───────────────────────────────────────────────────────────

const HeroAbout = () => {
  const { language, setLanguage } = useI18n()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const isRTL = language === 'he'

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Image: stays left, subtle scale growth into About phase
  const imageScale = useTransform(scrollYProgress, [0, 0.35, 0.78], [1.0, 1.0, 1.05])
  const imageXLTR = useTransform(scrollYProgress, [0, 0.78], ['0vw', '2vw'])
  const imageXRTL = useTransform(scrollYProgress, [0, 0.78], ['0vw', '2vw'])
  const imageY = useTransform(scrollYProgress, [0, 0.35, 0.78], ['0vh', '0vh', '0vh'])

  // Hero text: fades out as you scroll
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22, 0.42], [1, 1, 0])
  const heroY = useTransform(scrollYProgress, [0.22, 0.42], ['0px', '-14px'])

  // About text: fades in after hero text is gone
  const aboutOpacity = useTransform(scrollYProgress, [0.54, 0.78], [0, 1])
  const aboutYMotion = useTransform(scrollYProgress, [0.54, 0.78], ['14px', '0px'])

  const imageX = imageXLTR

  // Image crossfade — profile1 fades out, profile2 fades in, with a slight scale lift
  const image1Opacity = useTransform(scrollYProgress, [0.35, 0.58], [1, 0])
  const image2Opacity = useTransform(scrollYProgress, [0.48, 0.72], [0, 1])
  const image1Scale  = useTransform(scrollYProgress, [0.35, 0.58], [1, 1.04])
  const image2Scale  = useTransform(scrollYProgress, [0.48, 0.72], [0.96, 1])

  // Switch pointer events when about panel becomes dominant
  useEffect(() => {
    return scrollYProgress.on('change', (v) => setShowAbout(v > 0.5));
  }, [scrollYProgress]);

  const chips = language === 'he'
    ? ['7+ מיליון צפיות', '40%+ עליה בפניות', 'מותגים מקומיים סומכים']
    : ['7+M views', '40%+ lift in inquiries', 'Trusted by local brands']

  const tags = language === 'he'
    ? ['תוכן UGC', 'סרטוני טיקטוק', 'רילס אינסטגרם', 'אירועים']
    : ['UGC Content', 'TikTok Videos', 'Instagram Reels', 'Events']

  const handleWhatsApp = () => window.open('https://wa.me/message/D4AOECDSG35YE1', '_blank')

  // Photo always on left, text always on right side of viewport
  const textSideStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    right: 'var(--base-padding-x)',
    left: 'auto',
    maxWidth: '44%',
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

          {/* Decorative background arc */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
            viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
          >
            <circle cx="420" cy="520" r="420" fill="none" stroke="rgba(26,24,20,0.055)" strokeWidth="1.5" />
            <circle cx="420" cy="520" r="310" fill="none" stroke="rgba(26,24,20,0.035)" strokeWidth="1" />
          </svg>

          {/* THE shared image — bottom-anchored, full height */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 0,
              left: '4vw',
              right: 'auto',
              x: imageX, y: imageY, scale: imageScale,
              width: 'clamp(320px, 36vw, 500px)',
              height: '96vh',
              willChange: 'transform',
              zIndex: 2,
            }}
          >
            {/* Floating editorial badge */}
            <div style={{
              position: 'absolute',
              top: '18%',
              right: '-2rem',
              left: 'auto',
              zIndex: 10,
              background: 'var(--color-ink)',
              color: 'white',
              borderRadius: '9999px',
              padding: '0.4rem 1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 16px rgba(26,24,20,0.18)',
            }}>
              {language === 'he' ? '✦ זמינה לפרויקטים' : '✦ Available for projects'}
            </div>

            {/* Profile 1 — hero phase */}
            <motion.img
              src={HERO_IMAGE_1}
              alt="Shani"
              style={{
                position: 'absolute', bottom: 0, left: '50%', translateX: '-50%',
                width: '100%', height: '100%', objectFit: 'contain',
                objectPosition: 'bottom center',
                opacity: image1Opacity,
                scale: image1Scale,
                transformOrigin: 'bottom center',
                filter: 'drop-shadow(0 20px 40px rgba(26,24,20,0.18))',
              }}
            />
            {/* Profile 2 — about phase */}
            <motion.img
              src={HERO_IMAGE_2}
              alt="Shani"
              style={{
                position: 'absolute', bottom: 0, left: '50%', translateX: '-50%',
                width: '100%', height: '100%', objectFit: 'contain',
                objectPosition: 'bottom center',
                opacity: image2Opacity,
                scale: image2Scale,
                transformOrigin: 'bottom center',
                filter: 'drop-shadow(0 20px 40px rgba(26,24,20,0.18))',
              }}
            />
          </motion.div>

          {/* Bottom marquee strip */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5,
            borderTop: '1px solid rgba(26,24,20,0.10)',
            background: 'var(--color-cream)',
            overflow: 'hidden', height: '2.8rem', display: 'flex', alignItems: 'center',
          }}>
            <motion.div
              animate={{ x: isRTL ? ['0%', '50%'] : ['0%', '-50%'] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', paddingInline: '2rem' }}
            >
              {Array(6).fill(null).map((_, i) => (
                <span key={i} style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--color-ink-muted)',
                  display: 'flex', alignItems: 'center', gap: '2rem',
                }}>
                  <span>ניהול סושיאל</span>
                  <span style={{ color: 'var(--color-orange)' }}>✦</span>
                  <span>צילום רילס</span>
                  <span style={{ color: 'var(--color-orange)' }}>✦</span>
                  <span>אירועים וחתונות</span>
                  <span style={{ color: 'var(--color-orange)' }}>✦</span>
                  <span>Save The Date</span>
                  <span style={{ color: 'var(--color-orange)' }}>✦</span>
                  <span>צילומי מלונאות</span>
                  <span style={{ color: 'var(--color-orange)' }}>✦</span>
                  <span>בניית מותג</span>
                  <span style={{ color: 'var(--color-orange)' }}>✦</span>
                </span>
              ))}
            </motion.div>
          </div>

          {/* Hero text — fades out, receives clicks only while hero is shown */}
          <motion.div style={{ ...textSideStyle, translateY: '-50%', opacity: heroOpacity, y: heroY, pointerEvents: showAbout ? 'none' : 'auto' }}>
            <HeroText language={language} chips={chips} onWhatsApp={handleWhatsApp} />
          </motion.div>

          {/* About text — fades in, receives clicks only once about is shown */}
          <motion.div style={{ ...textSideStyle, translateY: '-50%', opacity: aboutOpacity, y: aboutYMotion, pointerEvents: showAbout ? 'auto' : 'none' }}>
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

          <img src={HERO_IMAGE_1} alt="Shani" style={{
            width: 'clamp(240px, 72vw, 340px)', height: 'auto',
            objectFit: 'contain', position: 'relative', zIndex: 1,
            filter: 'drop-shadow(0 16px 32px rgba(26,24,20,0.18))',
          }} />

          <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 400 }}>
            <HeroText language={language} chips={chips} onWhatsApp={handleWhatsApp} />
          </div>
        </section>

        {/* Mobile About */}
        <section id="about" style={{
          background: 'var(--color-cream)', padding: '4rem var(--base-padding-x)',
          borderTop: '1px solid var(--color-line)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem',
        }}>
          <img src={HERO_IMAGE_2} alt="Shani" style={{
            width: 'clamp(240px, 72vw, 340px)', height: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 16px 32px rgba(26,24,20,0.18))',
          }} />
          <AboutText language={language} tags={tags} onGallery={() => setGalleryOpen(true)} />
        </section>
      </div>

      <StoriesGalleryModal isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} />
    </>
  )
}

export default HeroAbout
