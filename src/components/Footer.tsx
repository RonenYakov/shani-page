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
      <span className="ft-mark" aria-hidden="true">✦</span>
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
