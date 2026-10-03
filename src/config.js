// API base URL:
// - In development: empty string → Vite proxy forwards /api/* to localhost:5000
// - In production (Render): set VITE_API_URL env variable to your backend service URL
//   e.g. https://vhm-ai-backend.onrender.com
const API_BASE = import.meta.env.VITE_API_URL || '';

export default API_BASE;
