import React, { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface OptimizedVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster?: string;
  /**
   * How many pixels before entering viewport to start loading
   * @default 300
   */
  preloadMargin?: string;
  /**
   * Whether to load immediately (for hero/first items)
   * @default false
   */
  loadImmediately?: boolean;
  /**
   * Whether to pause when not visible
   * @default true
   */
  pauseWhenNotVisible?: boolean;
  /**
   * Priority level for loading
   * 'high' - loads immediately
   * 'medium' - loads with IntersectionObserver
   * 'low' - loads only when visible
   */
  priority?: 'high' | 'medium' | 'low';
}

/**
 * Optimized video component with lazy loading, progressive loading, and visibility management
 * - Uses IntersectionObserver for efficient loading
 * - Preloads videos before they enter viewport
 * - Pauses videos when scrolled out of view
 * - Supports priority-based loading
 */
export const OptimizedVideo = React.forwardRef<HTMLVideoElement, OptimizedVideoProps>(
  (
    {
      src,
      poster,
      preloadMargin = '300px',
      loadImmediately = false,
      pauseWhenNotVisible = true,
      priority = 'medium',
      preload: controlledPreload,
      autoPlay,
      className,
      ...rest
    },
    forwardedRef
  ) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [shouldLoad, setShouldLoad] = useState(loadImmediately || priority === 'high');
    const [isVisible, setIsVisible] = useState(false);
    const [hasStartedLoading, setHasStartedLoading] = useState(false);
    const isMobile = useIsMobile();

    // Combine refs
    React.useImperativeHandle(forwardedRef, () => videoRef.current as HTMLVideoElement, []);

    // Determine preload strategy based on priority
    const getPreloadValue = (): 'none' | 'metadata' | 'auto' => {
      if (controlledPreload && ['none', 'metadata', 'auto'].includes(controlledPreload)) {
        return controlledPreload as 'none' | 'metadata' | 'auto';
      }
      if (priority === 'high' || loadImmediately) return 'auto';
      if (priority === 'medium') return 'metadata';
      return 'none';
    };

    // IntersectionObserver for lazy loading
    useEffect(() => {
      if (shouldLoad || loadImmediately || priority === 'high') return;

      const videoElement = videoRef.current;
      if (!videoElement) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setShouldLoad(true);
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: preloadMargin,
          threshold: 0.01,
        }
      );

      observer.observe(videoElement);

      return () => {
        observer.disconnect();
      };
    }, [shouldLoad, loadImmediately, priority, preloadMargin]);

    // Visibility observer for pause/play
    useEffect(() => {
      if (!pauseWhenNotVisible || !shouldLoad) return;

      const videoElement = videoRef.current;
      if (!videoElement) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsVisible(entry.isIntersecting);
            
            if (entry.isIntersecting) {
              // Video entered viewport - resume if it was playing
              if (autoPlay && videoElement.paused) {
                videoElement.play().catch(() => {
                  // Autoplay failed, user interaction required
                });
              }
            } else {
              // Video left viewport - pause to save resources
              if (!videoElement.paused) {
                videoElement.pause();
              }
            }
          });
        },
        {
          threshold: 0.5, // Consider visible when 50% is in viewport
        }
      );

      observer.observe(videoElement);

      return () => {
        observer.disconnect();
      };
    }, [shouldLoad, pauseWhenNotVisible, autoPlay]);

    // Handle video loading
    const handleLoadedData = () => {
      setHasStartedLoading(true);
      if (rest.onLoadedData) {
        rest.onLoadedData({ currentTarget: videoRef.current } as React.SyntheticEvent<HTMLVideoElement, Event>);
      }
    };

    const preloadValue = getPreloadValue();

    return (
      <div className="relative w-full h-full">
        {/* Poster image - shows until video loads */}
        {poster && !hasStartedLoading && (
          <img
            src={poster}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading={priority === 'high' ? 'eager' : 'lazy'}
            aria-hidden="true"
          />
        )}
        
        {/* Video element - only loads when shouldLoad is true */}
        {shouldLoad ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            preload={preloadValue}
            autoPlay={autoPlay}
            className={className}
            style={{
              opacity: hasStartedLoading ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
            }}
            onLoadedData={handleLoadedData}
            {...rest}
          />
        ) : (
          // Placeholder to maintain layout
          <div className="w-full h-full bg-gray-200" aria-hidden="true" />
        )}
      </div>
    );
  }
);

OptimizedVideo.displayName = 'OptimizedVideo';

