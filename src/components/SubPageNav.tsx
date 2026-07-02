import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "./SubPageNav.css";

/** Minimal top bar for the standalone /process and /faq pages — back to home + brand. */
const SubPageNav = ({ label }: { label: string }) => (
  <header className="shani-subnav">
    <Link to="/" className="sn-back">
      <ArrowLeft size={15} strokeWidth={2.5} aria-hidden="true" />
      <span>Back</span>
    </Link>

    <span className="sn-label">{label}</span>

    <Link to="/" aria-label="Shani home" className="sn-brand">
      SHANI
    </Link>
  </header>
);

export default SubPageNav;
