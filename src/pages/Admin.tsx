import { useState } from "react";
import "./Admin.css";

// the name we store the token under in the browser. one constant so login,
// logout, and the API calls (later) all agree on the same key.
const TOKEN_KEY = "shani_admin_token";
const CATEGORIES = [{ id: "photoshoot", label: "photoshoot" },
{ id: "weddings", label: "Weddings" },
{ id: "management", label: "Management" },
{ id: "ugc", label: "UGC" },
];

export default function Admin() {
  const [category, setCategory] = useState("photoshoot")// we set it at a random state at first so it woulden be blank

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || ""); // we store the token in the browser storage so we dont need to typew it every timr the page refreshes

  // password box + error message — ordinary form state, done for you.
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); // stop the browser's default "reload the page on submit"
    if (!input.trim()) {
      setError("Please enter the password.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/api/auth/check", {
        headers: { Authorization: `Bearer ${input}` }
        //we take the input password and make sure we have the barrer like the server ecpects
      });
      if (res.ok) {//meaning the token passed
        localStorage.setItem(TOKEN_KEY, input);
        setToken(input);
      } else {
        setError("Invalid password");
      }
    } catch {

      setError("cant reach the server");
    }


  }

  async function handleLogout() {
    localStorage.removeItem(TOKEN_KEY) // we remove the token from the browser
    setToken("") // we update the state to empty string
  }

  // ── not logged in → show the gate ──
  if (!token) {
    return (
      <div className="admin admin-login">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <span className="admin-eyebrow">
            <span className="dot" />
            Shani · Media
          </span>
          <h1 className="admin-login-title">Sign in</h1>
          <p className="admin-login-sub">Enter the admin password to manage media.</p>

          {error && <p className="admin-error">{error}</p>}

          <label className="admin-field">
            <input
              className="admin-input"
              type="password"
              placeholder="Password"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              autoFocus
            />
          </label>

          <button className="admin-btn" type="submit">
            Enter
          </button>
        </form>
      </div>
    );
  }

  // ── logged in → placeholder shell (real dashboard built in the next steps) ──
  return (
    //containers like div nav header section and more, they all render the same on the page but all have a different meaning if we use nav the broweser know the is a navigation bar ahead
    <div className="admin admin-shell">
      <header className="admin-header">
        <span className="admin-eyebrow">
          <span className="dot" />
          Shani · Media
        </span>
        <button className="admin-logout" onClick={handleLogout}>
          Log out
        </button>
      </header>
      <p style={{ marginTop: 40, color: "var(--color-ink-muted)" }}>
        ✓ Logged in. The dashboard (categories, upload, grid, delete) gets built here next.
      </p>
    </div>
  );
}
