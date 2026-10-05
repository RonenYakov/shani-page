import { setVideosPaused, useVideosPaused } from '@/hooks/useVideosPaused'
import './PauseVideosButton.css'

/** Page-wide pause/play for the autoplaying background videos. */
const PauseVideosButton = () => {
  const paused = useVideosPaused()
  return (
    <button
      type="button"
      className="pause-videos"
      aria-pressed={paused}
      onClick={() => setVideosPaused(!paused)}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {paused ? <path d="M8 5v14l11-7z" /> : <path d="M6 5h4v14H6zM14 5h4v14h-4z" />}
      </svg>
      {paused ? 'הפעל וידאו' : 'השהה וידאו'}
    </button>
  )
}

export default PauseVideosButton
