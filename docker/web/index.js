import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Redis from "ioredis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);

const app = express();
const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

// Serve a tiny static page
app.use(express.static(path.join(__dirname, "public")));

app.get("/current-quote", async (_req, res) => {
  try {
    const q = (await redis.get("current_quote")) || "No quote yet.";
    res.json({ quote: q });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to read quote" });
  }
});

app.listen(PORT, () => {
  console.log(`web listening on port ${PORT}`);
  console.log(`Using Redis at ${REDIS_HOST}:${REDIS_PORT}`);
});
