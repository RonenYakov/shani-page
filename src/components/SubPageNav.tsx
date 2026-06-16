import { Link } from "react-router-dom";

/** Minimal top bar for the standalone /process and /faq pages — back to home + brand. */
const SubPageNav = ({ label }: { label: string }) => (
  <header
    style={{
      position: "sticky",
      top: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1.1rem var(--base-padding-x)",
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(16,12,13,0.08)",
      fontFamily: '"Archivo", system-ui, sans-serif',
    }}
  >
    <Link
      to="/"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        textDecoration: "none",
        color: "#100c0d",
        fontWeight: 700,
        fontSize: "0.8rem",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      <span style={{ fontSize: "1.1rem", lineHeight: 1, color: "#F2B1B1" }}>←</span>
      Back
    </Link>

    <span
      style={{
        fontFamily: 'ui-monospace, "SFMono-Regular", Menlo, monospace',
        fontSize: "0.62rem",
        textTransform: "uppercase",
        letterSpacing: "0.22em",
        color: "#6a605f",
      }}
    >
      {label}
    </span>

    <Link
      to="/"
      aria-label="Shani home"
      style={{
        fontWeight: 900,
        fontSize: "1.1rem",
        letterSpacing: "0.18em",
        color: "#100c0d",
        textDecoration: "none",
      }}
    >
      SHANI
    </Link>
  </header>
);

export default SubPageNav;
