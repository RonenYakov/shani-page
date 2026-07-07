import { useState, useEffect } from "react";
import "./Admin.css";
import { SortableTile } from "./SortableTile"
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { API_URL } from "../lib/api";
import { getMedia, uploadToSignedUrl } from "../lib/supabase";
import { convertVideoForUpload } from "../lib/videoConvert";
import { compressImageForUpload } from "../lib/imageCompress";

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
  const [media, setMedia] = useState<{ videos: string[]; photos: string[] }>({ videos: [], photos: [] });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || ""); // we store the token in the browser storage so we dont need to typew it every timr the page refreshes
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );
  function loadMedia() {
    // reads go straight to Supabase (same source the live site uses) — no need to
    // wake up the Render server or wait on it just to list files
    getMedia(category)
      .then((data) => setMedia(data))
      .catch(() => setError("cant reach the server"));
  }

  useEffect(() => {
    loadMedia();
  }, [category])


  // password box + error message — ordinary form state, done for you.
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null); //we tell state what type it should hold file or null only
  const [converting, setConverting] = useState(false);
  const [convertProgress, setConvertProgress] = useState(0);
  async function handleDragEnd(event: DragEndEvent, type: "videos" | "photos") {
    const { active, over } = event;
    if (!over || active.id === over.id) return; // dropped nowhere / same spot → do nothing

    const list = media[type];
    const oldIndex = list.indexOf(active.id as string);
    const newIndex = list.indexOf(over.id as string);
    const newList = arrayMove(list, oldIndex, newIndex);

    setMedia({ ...media, [type]: newList });                 // optimistic: update UI instantly

    const filenames = newList.map((u) => u.split("/").pop()); // urls → filenames (like delete)
    try {
      await fetch(`${API_URL}/api/media/${category}/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filenames }),
      });
    } catch {
      setError("reorder failed");
    }
  }
  async function handleDelete(url: string) {
    const filename = url.split("/").pop();
    if (!filename) return;

    if (!window.confirm(`Delete ${filename}? This can't be undone.`)) return;// pop a box asking the user if he is sure

    try {
      const res = await fetch(
        `${API_URL}/api/media/${category}/${filename}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        loadMedia();          // re-read so the tile disappears
      } else {
        setError("delete failed");
      }
    } catch {
      setError("cant reach the server");
    }
  }




  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); // stop the browser's default "reload the page on submit"
    if (!input.trim()) {
      setError("Please enter the password.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/auth/check`, {
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
  async function handleUpload() {
    if (!file) return
    setError("");

    let toUpload = file;
    if (file.type.startsWith("video/") || file.name.toLowerCase().endsWith(".mov")) {
      // convert in the browser first: MOV → MP4, capped at ~1080p/50MB, so it plays
      // everywhere and never touches Render or Supabase as a giant raw phone file
      setConverting(true);
      setConvertProgress(0);
      try {
        toUpload = await convertVideoForUpload(file, setConvertProgress);
      } catch (err) {
        setError(err instanceof Error ? err.message : "המרת הווידאו נכשלה");
        setConverting(false);
        return;
      }
      setConverting(false);
    } else {
      toUpload = await compressImageForUpload(file);
    }

    // 1) ask the server for a signed Storage URL — a small JSON round trip, not a file upload
    const ext = "." + toUpload.name.split(".").pop();
    const type = toUpload.type.startsWith("video/") ? "video" : "photo";
    try {
      const signRes = await fetch(`${API_URL}/api/media/${category}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ext }),
      });
      if (!signRes.ok) {
        setError("upload failed");
        return;
      }
      const { filename, token: uploadToken, path: storagePath } = await signRes.json();

      // 2) bytes go straight from the browser to Supabase Storage — Render never sees them
      await uploadToSignedUrl(storagePath, uploadToken, toUpload);

      // 3) tell the server the upload is done so it can record the row
      const confirmRes = await fetch(`${API_URL}/api/media/${category}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filename, type }),
      });
      if (confirmRes.ok) {
        setFile(null);
        loadMedia()
      } else {
        setError("upload failed");
      }
    } catch {
      setError("cant reach the server");
    }
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
      <nav className="admin-tabs">
        {CATEGORIES.map((c) => (
          <button
            key={c.id} // makeing a uniqe key for each tab
            className={category === c.id ? "admin-tab admin-tab-active" : "admin-tab"} //if the catgeory equals the tab id the 
            onClick={() => setCategory(c.id)} //clicking a tab callse the use state changes it and the page rerenders
          >
            {c.label}
          </button>
        ))

        }
      </nav>
      <input
        type="file"
        accept="image/*,video/*,.mov"
        disabled={converting}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button className="admin-btn" onClick={handleUpload} disabled={!file || converting}>
        {converting ? `Converting… ${Math.round(convertProgress * 100)}%` : "Upload"}
      </button>
      {error && <p className="admin-error">{error}</p>}

      <section className="admin-group">
        <h2 className="admin-group-title">Photos </h2>
        {media.photos.length === 0 ? (<p className="admin-empty"> no photos yet</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, "photos")}>
            <SortableContext items={media.photos} strategy={rectSortingStrategy}>
              <div className="admin-grid">
                {media.photos.map((url) => (
                  <SortableTile key={url} url={url} type="photo" onDelete={handleDelete} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>
      <section className="admin-group">
        <h2 className="admin-group-title">Videos ({media.videos.length})</h2>
        {media.videos.length === 0 ? (<p className="admin-empty"> no videos yet</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, "videos")}>
            <SortableContext items={media.videos} strategy={rectSortingStrategy}>
              <div className="admin-grid">
                {media.videos.map((url) => (
                  <SortableTile key={url} url={url} type="video" onDelete={handleDelete} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>
    </div>
  );
}
