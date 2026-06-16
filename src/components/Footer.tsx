import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-black/10 py-6">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <nav
          aria-label="Secondary"
          className="mb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          style={{
            fontFamily: '"Archivo", system-ui, sans-serif',
            fontSize: "0.72rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <a href="/#work" className="text-black/60 hover:text-black transition-colors">Work</a>
          <a href="/#about" className="text-black/60 hover:text-black transition-colors">About</a>
          <Link to="/process" className="text-black/60 hover:text-black transition-colors">Process</Link>
          <Link to="/faq" className="text-black/60 hover:text-black transition-colors">FAQ</Link>
          <a href="/#contact" className="text-black/60 hover:text-black transition-colors">Contact</a>
        </nav>
        <p className="text-xs text-black/60" dir="rtl">
          © {year} כל הזכויות על כל התוכן באתר שייכות לשני בסה
        </p>
      </div>
    </footer>
  );
};

export default Footer;


