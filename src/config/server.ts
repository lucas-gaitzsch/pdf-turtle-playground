export const serverBaseUrl = ["localhost", "127.0.0.1"].includes(location.hostname)
  ? "http://localhost:8000"
  : location.origin
