import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const EASE = [0.35, 0, 0, 1] as const

// Plays once per session (sessionStorage flag)
const IntroShutter = () => {
  const [phase, setPhase] = useState<'closing' | 'open' | 'done'>('closing')

  useEffect(() => {
    if (sessionStorage.getItem('shutter-shown')) {
      setPhase('done')
      return
    }
    // Close → hold → open
    const openTimer = setTimeout(() => setPhase('open'), 900)
    const doneTimer = setTimeout(() => {
      setPhase('done')
      sessionStorage.setItem('shutter-shown', '1')
    }, 1800)
    return () => { clearTimeout(openTimer); clearTimeout(doneTimer) }
  }, [])

  if (phase === 'done') return null

  const closing = phase === 'closing'

  // Shared panel style
  const panel = (origin: string, closedX: string, closedY: string) => ({
    initial:  { x: closedX === '0%' ? 0 : closedX, y: closedY === '0%' ? 0 : closedY },
    animate:  closing
      ? { x: 0, y: 0 }
      : { x: closedX === '0%' ? 0 : closedX, y: closedY === '0%' ? 0 : closedY },
    transition: { duration: 0.55, ease: EASE },
    style: {
      position: 'fixed' as const,
      background: '#1A1814',
      transformOrigin: origin,
      zIndex: 9999,
    },
  })

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none' }}>

        {/* Top panel */}
        <motion.div
          {...panel('top', '0%', '-100%')}
          style={{ ...panel('top', '0%', '-100%').style, top: 0, left: 0, right: 0, height: '50vh' }}
        />

        {/* Bottom panel */}
        <motion.div
          {...panel('bottom', '0%', '100%')}
          style={{ ...panel('bottom', '0%', '100%').style, bottom: 0, left: 0, right: 0, height: '50vh' }}
        />

        {/* Left panel */}
        <motion.div
          {...panel('left', '-100%', '0%')}
          style={{ ...panel('left', '-100%', '0%').style, top: 0, bottom: 0, left: 0, width: '50vw' }}
        />

        {/* Right panel */}
        <motion.div
          {...panel('right', '100%', '0%')}
          style={{ ...panel('right', '100%', '0%').style, top: 0, bottom: 0, right: 0, width: '50vw' }}
        />

        {/* Center logo — appears when panels are closed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={closing ? {} : { opacity: 0, scale: 0.85 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={phase === 'closing' ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.35, delay: phase === 'closing' ? 0.55 : 0, ease: EASE }}
          >
            <img
              src="/shani-logo2.webp"
              alt="Shani"
              style={{ height: '6rem', filter: 'brightness(0) invert(1)', display: 'block' }}
            />
            <div style={{
              textAlign: 'center', marginTop: '0.75rem',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '0.6rem', letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#D4622A',
            }}>
              ✦ צילום · סושיאל · אירועים ✦
            </div>
          </motion.div>
        </motion.div>

      </div>
    </AnimatePresence>
  )
}

export default IntroShutter
