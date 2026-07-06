// one source of truth for the backend URL.
// dev: falls back to localhost. prod: set VITE_API_URL in the host's env.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";