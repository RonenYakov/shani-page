import { useState, useRef } from 'react'
import { motion, useAnimation, PanInfo } from 'framer-motion'
import { useI18n } from '@/i18n/simple'

interface DraggableCardProps {
  topImage: string
  bottomImage: string
  isMobile: boolean
  width?: number
  height?: number
}

const DraggableCard = ({
  topImage,
  bottomImage,
  isMobile,
  width = 380,
  height = 500,
}: DraggableCardProps) => {
  const { language } = useI18n()
  const [isRemoved, setIsRemoved] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const [topLoaded, setTopLoaded] = useState(false)
  const [bottomLoaded, setBottomLoaded] = useState(false)
  const cardControls = useAnimation()
  const flyingOff = useRef(false)

  const cardStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    borderRadius: 16,
    overflow: 'hidden',
  }

  const handleDragStart = () => {
    setIsDragging(true)
    setShowHint(false)
  }

  const handleDrag = (_: PointerEvent, info: PanInfo) => {
    if (flyingOff.current) return
    if (Math.abs(info.offset.x) > 180) {
      flyingOff.current = true
      flyOff(info.offset.x)
    }
  }

  const flyOff = (dx: number) => {
    const targetX = dx > 0 ? 2000 : -2000
    cardControls
      .start({
        x: targetX,
        transition: { duration: 0.35, ease: [0.35, 0, 0, 1] },
      })
      .then(() => setIsRemoved(true))
  }

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    if (flyingOff.current) return
    if (Math.abs(info.offset.x) <= 180) {
      cardControls.start({
        x: 0,
        transition: { duration: 0.4, ease: [0.35, 0, 0, 1] },
      })
    }
  }

  return (
    <div style={{ position: 'relative', width, height, flexShrink: 0 }}>
      {/* Card 2 — bottom, static, always visible */}
      <div style={{ ...cardStyle, zIndex: 1 }}>
        {!bottomLoaded && (
          <div
            style={{ width: '100%', height: '100%', background: 'var(--color-cream-dark)' }}
          />
        )}
        <img
          src={bottomImage}
          alt=""
          role="presentation"
          onLoad={() => setBottomLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: bottomLoaded ? 'block' : 'none',
          }}
        />
      </div>

      {/* Card 1 — top, draggable */}
      {/* TODO: replace with final hero image */}
      {!isRemoved && (
        <motion.div
          drag={isMobile ? false : 'x'}
          animate={cardControls}
          dragElastic={0.08}
          dragTransition={{ bounceStiffness: 80, bounceDamping: 15 }}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          aria-label={
            language === 'he'
              ? 'גרור לגילוי עבודה נוספת'
              : 'Drag to reveal more work'
          }
          style={{
            ...cardStyle,
            zIndex: isDragging ? 20 : 2,
            cursor: isMobile ? 'default' : isDragging ? 'grabbing' : 'grab',
            willChange: 'transform',
          }}
        >
          {!topLoaded && (
            <div
              style={{ width: '100%', height: '100%', background: 'var(--color-cream-dark)' }}
            />
          )}
          <img
            src={topImage}
            alt=""
            role="presentation"
            onLoad={() => setTopLoaded(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: topLoaded ? 'block' : 'none',
            }}
          />

          {/* Drag hint badge */}
          {!isMobile && (
            <motion.div
              animate={{ opacity: showHint ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                bottom: 12,
                insetInlineEnd: 12,
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--color-orange)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  color: 'white',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {language === 'he' ? 'גרור' : 'DRAG'}
              </span>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default DraggableCard
