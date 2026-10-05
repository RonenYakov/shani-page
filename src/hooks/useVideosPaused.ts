import { useSyncExternalStore } from 'react'

// One page-wide switch for every autoplaying, looping video (WCAG 2.2.2: moving
// content that runs over 5s needs a pause mechanism). Starts paused for visitors
// who asked their OS for reduced motion.
let paused =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const listeners = new Set<() => void>()

export const setVideosPaused = (v: boolean) => {
  paused = v
  listeners.forEach(l => l())
}
export const getVideosPaused = () => paused

export const useVideosPaused = () =>
  useSyncExternalStore(
    cb => { listeners.add(cb); return () => { listeners.delete(cb) } },
    getVideosPaused,
    () => false,
  )
