import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import "./HomeButton.css";

/** Floating "SHANI" home button — appears once the user scrolls past the hero,
 *  click smooth-scrolls back to the top. Rendered on the main page only. */
const HomeButton = () => {
  const [show, setShow] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goHome = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className="shani-homebtn"
      data-show={show}
      onClick={goHome}
      aria-label="Back to top"
    >
      <svg className="flower" viewBox="0 0 24 24" aria-hidden="true">
        <g fill="var(--rose)">
          <ellipse cx="12" cy="5.4" rx="2.5" ry="3.6" />
          <ellipse cx="12" cy="18.6" rx="2.5" ry="3.6" />
          <ellipse cx="5.4" cy="12" rx="3.6" ry="2.5" />
          <ellipse cx="18.6" cy="12" rx="3.6" ry="2.5" />
          <ellipse cx="7.2" cy="7.2" rx="2.7" ry="2.7" opacity=".9" />
          <ellipse cx="16.8" cy="16.8" rx="2.7" ry="2.7" opacity=".9" />
        </g>
        <circle cx="12" cy="12" r="2.6" fill="#241b1b" />
      </svg>
      SHANI
    </button>
  );
};

export default HomeButton;
