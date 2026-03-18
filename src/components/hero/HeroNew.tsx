import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from '@/i18n/simple'
import DraggableCard from './DraggableCard'

gsap.registerPlugin(ScrollTrigger)

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.309" />
  </svg>
)

const HeroNew = () => {
  const { language, setLanguage } = useI18n()
  const heroRef = useRef<HTMLElement>(null)
  const topCardRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const isRTL = language === 'he'

  useEffect(() => {
    const check = () =>
      setIsMobile(
        window.matchMedia('(pointer: coarse)').matches ||
          window.innerWidth < 768
      )
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Scroll-driven card swap (desktop only)
  useEffect(() => {
    if (isMobile) return
    if (!topCardRef.current || !heroRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Top card slides out to the side as user scrolls through hero
      gsap.to(topCardRef.current, {
        x: isRTL ? '-120%' : '120%',
        opacity: 0,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '40% top',
          scrub: 1.2,
        },
      })
    }, heroRef)

    return () => ctx.revert()
  }, [isMobile, isRTL])

  const handleWhatsApp = () => {
    window.open('https://wa.me/message/D4AOECDSG35YE1', '_blank')
  }

  const chips =
    language === 'he'
      ? ['7+ מיליון צפיות', '40%+ עליה בפניות', 'מותגים מקומיים סומכים']
      : ['7+M views', '40%+ lift in inquiries', 'Trusted by local brands']

  const cardWidth = isMobile ? 260 : 380
  const cardHeight = isMobile ? 340 : 500

  return (
    <section
      ref={heroRef}
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        position: 'relative',
        minHeight: isMobile ? '100vh' : '200vh',
        background: 'var(--color-cream)',
        zIndex: 1,
      }}
    >
      {/* Sticky content area */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Nav bar */}
        <nav
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem var(--base-padding-x)',
            zIndex: 30,
          }}
        >
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {(['he', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  background:
                    language === lang
                      ? 'var(--color-ink)'
                      : 'rgba(26,24,20,0.08)',
                  color: language === lang ? 'white' : 'var(--color-ink)',
                  transition: 'all 0.2s',
                }}
              >
                {lang === 'he' ? 'עב' : 'EN'}
              </button>
            ))}
          </div>

          <img
            src="/shani-logo2.webp"
            alt="Shani Social Media"
            style={{ height: '3.5rem' }}
          />
        </nav>

        {/* Hero body */}
        {isMobile ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '6rem',
              paddingInline: 'var(--base-padding-x)',
              textAlign: 'center',
              gap: '1.5rem',
            }}
          >
            <MobileContent
              language={language}
              chips={chips}
              onWhatsApp={handleWhatsApp}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
            />
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              paddingTop: '6rem',
              paddingInline: 'var(--base-padding-x)',
            }}
          >
            {/* Headline block */}
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '55%' }}>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'var(--color-ink)',
                  marginBottom: '1rem',
                }}
              >
                {language === 'he'
                  ? 'ניהול סושיאל מדיה • תוכן וידאו'
                  : 'SOCIAL MEDIA MANAGEMENT • VIDEO CONTENT'}
              </p>

              <h1
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  margin: 0,
                }}
              >
                {language === 'he' ? (
                  <>
                    <span style={{ color: 'var(--color-orange)' }}>
                      סושיאל + וידאו
                    </span>
                    <br />
                    <span style={{ color: 'var(--color-ink)' }}>
                      שמביא תוצאות
                    </span>
                  </>
                ) : (
                  <>
                    <span style={{ color: 'var(--color-orange)' }}>
                      Social + Video
                    </span>
                    <br />
                    <span style={{ color: 'var(--color-ink)' }}>
                      that drives results
                    </span>
                  </>
                )}
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  color: 'var(--color-ink-muted)',
                  marginTop: '1.25rem',
                  marginBottom: '2rem',
                }}
              >
                {language === 'he'
                  ? 'טיקטוק/רילס שמייצרים באזז ופניות. הפקה + ניהול + שיפור.'
                  : 'TikTok/Reels that create buzz and inquiries. Production + management + iteration.'}
              </p>

              <button
                onClick={handleWhatsApp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'var(--color-orange)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '0.75rem 2rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  marginBottom: '1.25rem',
                }}
              >
                <WhatsAppIcon />
                {language === 'he' ? 'בואו נתחיל לעבוד יחד' : "Let's work together"}
              </button>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {chips.map((chip) => (
                  <span
                    key={chip}
                    style={{
                      background: 'rgba(26,24,20,0.06)',
                      border: '1px solid rgba(26,24,20,0.12)',
                      color: 'var(--color-ink)',
                      borderRadius: '9999px',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Card stack — top card controlled by scroll */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-40%)',
                insetInlineEnd: 'var(--base-padding-x)',
                zIndex: 2,
              }}
            >
              {/* Bottom card — always visible, scales up as top slides away */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: 16,
                  overflow: 'hidden',
                  zIndex: 1,
                }}
              >
                <img
                  src="/profile.webp"
                  alt=""
                  role="presentation"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Top card — scroll-driven slide out */}
              <div
                ref={topCardRef}
                style={{
                  position: 'relative',
                  width: cardWidth,
                  height: cardHeight,
                  zIndex: 2,
                }}
              >
                <DraggableCard
                  topImage="/story1.webp"
                  bottomImage="/profile.webp"
                  isMobile={false}
                  width={cardWidth}
                  height={cardHeight}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

interface MobileContentProps {
  language: string
  chips: string[]
  onWhatsApp: () => void
  cardWidth: number
  cardHeight: number
}

const MobileContent = ({
  language,
  chips,
  onWhatsApp,
  cardWidth,
  cardHeight,
}: MobileContentProps) => (
  <>
    <p
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: 'var(--color-ink)',
      }}
    >
      {language === 'he'
        ? 'ניהול סושיאל מדיה • תוכן וידאו'
        : 'SOCIAL MEDIA MANAGEMENT • VIDEO CONTENT'}
    </p>

    <h1
      style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: 'clamp(2.2rem, 10vw, 3.5rem)',
        lineHeight: 1.05,
        letterSpacing: '-0.02em',
        margin: 0,
      }}
    >
      {language === 'he' ? (
        <>
          <span style={{ color: 'var(--color-orange)' }}>סושיאל + וידאו</span>
          <br />
          <span style={{ color: 'var(--color-ink)' }}>שמביא תוצאות</span>
        </>
      ) : (
        <>
          <span style={{ color: 'var(--color-orange)' }}>Social + Video</span>
          <br />
          <span style={{ color: 'var(--color-ink)' }}>that drives results</span>
        </>
      )}
    </h1>

    <DraggableCard
      topImage="/story1.webp"
      bottomImage="/profile.webp"
      isMobile={true}
      width={cardWidth}
      height={cardHeight}
    />

    <p
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'var(--color-ink-muted)',
        letterSpacing: '0.1em',
      }}
    >
      {language === 'he' ? 'הזזי לצפייה בעבודות ←' : 'Swipe to see work →'}
    </p>

    <button
      onClick={onWhatsApp}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'var(--color-orange)',
        color: 'white',
        border: 'none',
        borderRadius: '9999px',
        padding: '0.75rem 2rem',
        fontFamily: 'var(--font-body)',
        fontSize: '1rem',
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {language === 'he' ? 'בואו נתחיל לעבוד יחד' : "Let's work together"}
    </button>

    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
      {chips.map((chip) => (
        <span
          key={chip}
          style={{
            background: 'rgba(26,24,20,0.06)',
            border: '1px solid rgba(26,24,20,0.12)',
            color: 'var(--color-ink)',
            borderRadius: '9999px',
            padding: '0.25rem 0.75rem',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-body)',
          }}
        >
          {chip}
        </span>
      ))}
    </div>
  </>
)

export default HeroNew
