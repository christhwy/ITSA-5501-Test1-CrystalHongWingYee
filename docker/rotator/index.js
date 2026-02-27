import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT || "6379", 10);
const ROTATE_MS = parseInt(process.env.ROTATE_MS || "5000", 10);

const redis = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

const QUOTES = [
  "Simplicity is the soul of efficiency. — Austin Freeman",
  "First, solve the problem. Then, write the code. — John Johnson",
  "Make it work, make it right, make it fast. — Kent Beck",
  "The only way to go fast, is to go well. — Robert C. Martin",
  "Programs must be written for people to read. — Harold Abelson"
];

let i = 0;

async function rotate() {
  try {
    const q = QUOTES[i % QUOTES.length];
    await redis.set("current_quote", q);
    console.log(`Set quote -> ${q}`);
    i++;
  } catch (e) {
    console.error("Failed to set quote:", e);
  }
}

console.log(`rotator started. redis=${REDIS_HOST}:${REDIS_PORT}, interval=${ROTATE_MS}ms`);
rotate();
setInterval(rotate, ROTATE_MS);

