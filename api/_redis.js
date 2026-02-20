import { createClient } from "redis";

let clientPromise = null;

export async function getRedisClient() {
  if (clientPromise) return clientPromise;

  const url = process.env.REDIS_URL;
  if (!url) {
    throw new Error("Missing REDIS_URL env var (Vercel Redis not connected?)");
  }

  const client = createClient({ url });

  clientPromise = (async () => {
    await client.connect();
    return client;
  })();

  return clientPromise;
}