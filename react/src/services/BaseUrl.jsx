const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const baseUrl = isLocal
  ? "http://localhost:8000"
  : "https://library-management-2xx8.onrender.com";