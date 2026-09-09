/**
 * Visitor counter for syntagmata.com.
 *
 * - Reads the visitor's IP from Cloudflare's CF-Connecting-IP header.
 * - Immediately HMAC-hashes it with a secret salt (COUNTER_SALT, set via
 *   `wrangler secret put`) — the raw IP is never written to D1, never
 *   logged, and never leaves this function call.
 * - INSERT OR IGNORE into D1 keyed on that hash. If the hash already
 *   exists, nothing happens — that's the "new IP" dedupe.
 * - Returns the current total unique-visitor count as JSON.
 *
 * GET /count           -> counts this visit if new, returns { count }
 * GET /count?peek=1     -> just reads the count, never counts this visit
 *                          (use this when checking manually so your own
 *                          visits don't inflate the number)
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== "/count") {
      return new Response("not found", { status: 404 });
    }

    // CORS: only your own site's pages should be able to call this.
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = origin.endsWith(".syntagmata.com") || origin === "https://syntagmata.com"
      ? origin
      : "https://syntagmata.com";

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const isPeek = url.searchParams.get("peek") === "1";

    if (!isPeek) {
      const ip = request.headers.get("CF-Connecting-IP") || "";
      if (ip) {
        const ipHash = await hashIp(ip, env.COUNTER_SALT);
        await env.DB.prepare(
          "INSERT OR IGNORE INTO visitors (ip_hash, first_seen) VALUES (?, ?)"
        )
          .bind(ipHash, Date.now())
          .run();
        // ip and ipHash fall out of scope here — nothing persists them
        // beyond this request.
      }
    }

    const result = await env.DB.prepare(
      "SELECT COUNT(*) AS count FROM visitors"
    ).first();

    return new Response(JSON.stringify({ count: result.count }), {
      headers: corsHeaders,
    });
  },
};

async function hashIp(ip, salt) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(salt),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(ip));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
