import { useEffect, useRef } from "react";

export function useWheelSnapScroll<T extends HTMLElement>(
  containerRef: React.RefObject<T>,
  itemSelector: string
) {
  const pointsRef = useRef<number[]>([]);
  const indexRef = useRef(0);
  const animRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>(itemSelector));
      const pts = cards.map((card) =>
        Math.max(0, card.offsetLeft - (el.clientWidth - card.clientWidth) / 2)
      );
      pointsRef.current = pts;

      const current = el.scrollLeft;
      let best = 0;
      for (let i = 1; i < pts.length; i++) {
        if (Math.abs(pts[i] - current) < Math.abs(pts[best] - current)) best = i;
      }
      indexRef.current = best;
    };

    compute();
    const onResize = () => compute();
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => compute());
    ro.observe(el);
    el.querySelectorAll(itemSelector).forEach((c) => ro.observe(c));

    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return; // no overflow, do nothing

      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      if (absY >= absX) {
        // mouse wheel / vertical dominant
        e.preventDefault(); // prevent page scroll while hovered

        if (animRef.current || !pointsRef.current.length) return;
        const dir = e.deltaY > 0 ? 1 : -1; // down=next, up=prev

        let next = Math.min(
          pointsRef.current.length - 1,
          Math.max(0, indexRef.current + dir)
        );
        if (next === indexRef.current) return;

        indexRef.current = next;
        animRef.current = true;
        const target = pointsRef.current[next];

        el.scrollTo({ left: target, behavior: "smooth" });

        const unlock = () => {
          if (Math.abs(el.scrollLeft - target) < 2) {
            animRef.current = false;
            el.removeEventListener("scroll", unlock);
          }
        };
        el.addEventListener("scroll", unlock);
        setTimeout(() => {
          animRef.current = false;
          el.removeEventListener("scroll", unlock);
        }, 700);
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [containerRef, itemSelector]);
}


