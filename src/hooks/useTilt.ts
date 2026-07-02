import { useCallback, useEffect, useRef } from "react";
import { useSpring, useReducedMotion } from "framer-motion";
import type { MouseEvent } from "react";

/**
 * Mouse-driven 3D card tilt — cinematic, never bouncy.
 * Returns spring MotionValues (rotateX / rotateY / y) plus mouse handlers.
 * Active only on fine pointers with hover and when the user allows motion;
 * on touch / reduced-motion the values stay at 0 and the handlers no-op.
 */
export function useTilt(maxDeg = 4, lift = -6) {
  const reduceMotion = useReducedMotion();
  // high damping — smoothed follow, no overshoot
  const spring = { stiffness: 260, damping: 32, mass: 0.9 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const y = useSpring(0, spring);
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current =
      !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, [reduceMotion]);

  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!enabled.current) return;
      const r = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 … 0.5
      const py = (e.clientY - r.top) / r.height - 0.5;
      rotateY.set(px * maxDeg * 2);
      rotateX.set(-py * maxDeg * 2);
    },
    [maxDeg, rotateX, rotateY]
  );

  const onMouseEnter = useCallback(() => {
    if (enabled.current) y.set(lift);
  }, [lift, y]);

  const reset = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    y.set(0);
  }, [rotateX, rotateY, y]);

  return { rotateX, rotateY, y, onMouseMove, onMouseEnter, onMouseLeave: reset, reset };
}
