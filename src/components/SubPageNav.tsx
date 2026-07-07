import { Link } from "react-router-dom";
import "./SubPageNav.css";

/** Minimal top bar for the standalone /process and /faq pages — back to home + brand. */
const SubPageNav = ({ label }: { label: string }) => (
  <header className="shani-subnav">
    <Link to="/" className="sn-back">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>Back</span>
    </Link>

    <span className="sn-label">{label}</span>

    <Link to="/" aria-label="Shani home" className="sn-brand">
      SHANI
    </Link>
  </header>
);

export default SubPageNav;
