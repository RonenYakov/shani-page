import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, MotionValue } from "framer-motion";
import "./About.css";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

interface TileDef {
  src: string;
  /** optional muted autoplay video — when set, replaces the still image */
  video?: string;
  label: string;
  pos: string;
  /** parallax travel in px — sign sets direction */
  speed: number;
}

const TILES: TileDef[] = [
  { src: "/posters/IMG_2062.PNG", label: "shani", pos: "center", speed: 18 },
  {
    src: "/posters/weddings/proposel.webp",
    video: "/posters/1bf41d0fe19c4931882b16de52719aad.mp4",
    label: "on set",
    pos: "center",
    speed: -30,
  },
  { src: "/posters/wedding%20cover.jpg", label: "weddings", pos: "center", speed: 12 },
  {
    src: "/posters/theme/social-shoots.png",
    video: "/posters/4a6e045d63e542bf8534c6818cadc6ec.mp4",
    label: "the reel",
    pos: "center",
    speed: -40,
  },
];

/** Single photo tile — clip reveal on scroll-in + gentle parallax drift */
const Tile = ({
  tile,
  index,
  progress,
  factor,
}: {
  tile: TileDef;
  index: number;
  progress: MotionValue<number>;
  /** parallax intensity — 1 on desktop, softened on mobile */
  factor: number;
}) => {
  const y = useTransform(progress, [0, 1], [tile.speed * factor, -tile.speed * factor]);

  return (
    <motion.div className="sa-slot" style={{ y }}>
      <motion.div
        className="sa-tile"
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        whileInView={{ clipPath: "inset(0% 0 0 0)" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, delay: index * 0.12, ease: EASE }}
      >
        {tile.video ? (
          <video
            src={tile.video}
            poster={tile.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            aria-label={tile.label}
            style={{ objectPosition: tile.pos, pointerEvents: "none" }}
          />
        ) : (
          <img src={tile.src} alt={tile.label} loading="lazy" style={{ objectPosition: tile.pos }} />
        )}
        <motion.span
          className="sa-chip"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 + index * 0.12, ease: EASE }}
        >
          <span className="dot" />
          {tile.label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

/** Word-by-word mask reveal for one headline line */
const RevealLine = ({
  children,
  inView,
  baseDelay,
}: {
  children: (string | JSX.Element)[];
  inView: boolean;
  baseDelay: number;
}) => (
  <span style={{ display: "block" }}>
    {children.map((word, i) => (
      <span className="sa-word" key={i}>
        <motion.span
          initial={{ y: "110%" }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.9, delay: baseDelay + i * 0.09, ease: EASE }}
        >
          {word}
        </motion.span>
      </span>
    ))}
  </span>
);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section className="shani-about" id="about" ref={sectionRef}>
      {/* label + lead */}
      <div className="sa-top">
        <motion.div
          className="sa-labelwrap"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <i className="sa-cross" />
          <div className="sa-label">
            About
            <br />
            Shani
          </div>
        </motion.div>

        <motion.p
          className="sa-lead"
          dir="rtl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
        >
          היי אני שני, מגיל 10 התאהבתי ביצירת תוכן ומאז לא הפסקתי והיום בזכות האמון של הלקוחות שלי הפכתי את האהבה והחלום הזה למציאות שלי. המטרה שלי היא לגרום לכלות להיות מאושרות ולעסקים להגדיל את ההכנסה שלהם וכל זה נעשה בעזרת שנים של נסיון והציוד הכי מקצועי ממצלמה ועד לרחפן. אז הצטרפו אלי ותראו שיצרית תוכן זה הרבה מעבר לריל באינסטגרם.
        </motion.p>
      </div>

      {/* giant headline */}
      <h2 className="sa-giant" ref={headRef}>
        <RevealLine inView={headInView} baseDelay={0}>
          {["Stories", "that"]}
        </RevealLine>
        <RevealLine inView={headInView} baseDelay={0.18}>
          {[
            "stop",
            "the",
            <span className="ac" key="ac">
              scroll
            </span>,
          ]}
        </RevealLine>
      </h2>

      {/* staggered photo tiles */}
      <div className="sa-imgs">
        {TILES.map((tile, i) => (
          <Tile key={tile.src} tile={tile} index={i} progress={scrollYProgress} factor={isMobile ? 0.5 : 1} />
        ))}
      </div>
    </section>
  );
};

export default About;
