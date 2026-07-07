import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Footer.css";

const EASE: [number, number, number, number] = [0.35, 0, 0, 1];

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <motion.footer
      className="shani-footer"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <span className="ft-mark" aria-hidden="true">
        {/* the brand flower mark — same petals as the hero logo */}
        <svg width="14" height="14" viewBox="0 0 24 24">
          <g fill="var(--rose)">
            <ellipse cx="12" cy="5.4" rx="2.5" ry="3.6" />
            <ellipse cx="12" cy="18.6" rx="2.5" ry="3.6" />
            <ellipse cx="5.4" cy="12" rx="3.6" ry="2.5" />
            <ellipse cx="18.6" cy="12" rx="3.6" ry="2.5" />
            <ellipse cx="7.2" cy="7.2" rx="2.7" ry="2.7" opacity=".9" />
            <ellipse cx="16.8" cy="16.8" rx="2.7" ry="2.7" opacity=".9" />
          </g>
          <circle cx="12" cy="12" r="2.6" fill="#ffffff" />
        </svg>
      </span>
      <nav aria-label="Secondary" className="ft-nav">
        <a href="/#work">Work</a>
        <a href="/#about">About</a>
        <Link to="/process">Process</Link>
        <Link to="/faq">FAQ</Link>
        <a href="/#contact">Contact</a>
      </nav>
      <p className="ft-copy" dir="rtl">
        © {year} כל הזכויות על כל התוכן באתר שייכות לשני בסה
      </p>
    </motion.footer>
  );
};

export default Footer;
