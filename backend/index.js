import app from "./server.js";

export default function handler(req, res) {
  // Jalankan Express app di mode Vercel (Serverless)
  return app(req, res);
}