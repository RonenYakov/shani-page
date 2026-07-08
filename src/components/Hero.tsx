import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { socials } from "@/content/socials";
import RotatingBadge from "./RotatingBadge";
import "./Hero.css";

/**
 * Hero — "SHANI · Social Media Manager"
 * Pixel-faithful port of the Claude Design handoff (Shani.html) in its saved
 * state: light theme, accent #F2B1B1, Cinematic mood, Balanced subject.
 * Subtle mouse parallax on the headline + figure, exactly as the prototype.
 */
const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const hero = heroRef.current;
    const headline = headlineRef.current;
    const figure = figureRef.current;
    if (!hero || !headline || !figure) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (isTouch) {
      // mobile — scroll-driven parallax replaces mouse parallax
      let raf = 0;
      let ticking = false;
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        raf = requestAnimationFrame(() => {
          const y = Math.max(0, window.scrollY);
          const h = window.innerHeight;
          const p = Math.min(1, y / h);
          headline.style.transform = `translateY(${p * -46}px)`;
          headline.style.opacity = `${1 - p * 0.75}`;
          figure.style.transform = `translateY(${p * 26}px) scale(${1 + p * 0.04})`;
          ticking = false;
        });
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        cancelAnimationFrame(raf);
      };
    }

    let tx = 0, ty = 0, cx = 0, cy = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      const r = hero.getBoundingClientRect();
      tx = e.clientX / r.width - 0.5;
      ty = e.clientY / r.height - 0.5;
    };
    const onLeave = () => { tx = 0; ty = 0; };

    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      headline.style.transform = `translate(${cx * 22}px, ${cy * 12}px)`;
      figure.style.transform = `translate(${cx * -14}px, ${cy * -7}px)`;
      raf = requestAnimationFrame(tick);
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    tick();

    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="shani-hero" id="hero" ref={heroRef}>
      {/* giant headline behind subject */}
      <div className="layer headline" ref={headlineRef}>
        <div className="giant-wrap">
          <div className="kicker anim d3">
            <i className="kx" />
            Social<span className="line2">Media</span>
          </div>
          <div className="giant anim d4">Manager</div>
          {/* tagline anchored to right edge of MANAGER, moves with parallax */}
          <div className="tagline anim d5">
            <i className="mk" />
            <span className="bar" />
            <p className="txt">Where your story meets the scroll</p>
          </div>
        </div>
      </div>

      {/* subject */}
      <div className="layer figure" ref={figureRef}>
        <div className="figure-wrap">
          <img
            src="/shani-cut4.webp"
            alt="Shani, social media manager, taking a photo with her Canon camera"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* foreground UI */}
      <div className="layer ui">
        {/* top bar */}
        <header className="topbar">
          <a className="brand anim d1" href="#" aria-label="Shani home">
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
          </a>

          <nav className="menu anim d2" aria-label="Primary">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <Link to="/process">Process</Link>
            <Link to="/faq">FAQ</Link>
            <a href="#contact">Contact</a>
          </nav>

          <div className="actions anim d2">
            <button
              className="cta"
              type="button"
              onClick={() => window.open(socials.whatsappUrl, "_blank")}
            >
              Let's Work
            </button>
          </div>
          <button
            className={`burger${menuOpen ? " open" : ""}`}
            type="button"
            aria-label="Menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </header>

        {/* bottom band: caption · scroll cue · badge
            (desktop keeps each absolutely placed; mobile flexes them into one
            evenly-spaced row — see .hero-bottom in Hero.css) */}
        <div className="hero-bottom">
          {/* bottom-left caption */}
          <div className="caption anim d6">
            <div className="lead">Styled<br />to <em>Perfection</em></div>
          </div>

          {/* mobile scroll hint */}
          <div className="scroll-hint anim d6" aria-hidden="true">
            <span className="sh-txt">scroll</span>
            <span className="sh-line" />
          </div>

          {/* rotating badge */}
          <div className="badge anim d6" aria-hidden="true">
            <RotatingBadge pathId="circlePath" centerFill="#1a1314" />
          </div>
        </div>
      </div>

      {/* corner hairline cross */}
      <i className="cross br" />

      {/* mobile full-screen menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <button
          className="mm-close"
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          <span /><span />
        </button>
        <nav className="mm-links" aria-label="Mobile">
          <a href="#work" onClick={() => setMenuOpen(false)}>Work</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <Link to="/process" onClick={() => setMenuOpen(false)}>Process</Link>
          <Link to="/faq" onClick={() => setMenuOpen(false)}>FAQ</Link>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <button
          className="mm-cta"
          type="button"
          onClick={() => {
            setMenuOpen(false);
            window.open(socials.whatsappUrl, "_blank");
          }}
        >
          Let's Work
        </button>
      </div>

      {/* cinematic vignette + grain on top */}
      <div className="vignette" />
      <div className="grain" />
    </main>
  );
};

export default Hero;
