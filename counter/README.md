# syntagmata visitor counter

A unique-visitor counter with no visitor data retained — only a salted
one-way hash of each IP is ever written to the database, never the IP
itself.

## Deploy

```bash
cd counter-worker
npm install -g wrangler   # skip if you already have it
wrangler login

# 1. Create the D1 database
wrangler d1 create syntagmata-visitor-counter
# copy the database_id it prints into wrangler.toml

# 2. Create the table
wrangler d1 execute syntagmata-visitor-counter --remote --file=schema.sql

# 3. Set the hashing salt (pick any long random string, never reuse it
#    anywhere else, never commit it to git)
wrangler secret put COUNTER_SALT

# 4. Deploy
wrangler deploy
```

If you'd rather not point a `counter.syntagmata.com` subdomain at this,
delete the `[[routes]]` block in `wrangler.toml` and `wrangler deploy` will
give you a `syntagmata-counter.<your-subdomain>.workers.dev` URL instead —
use that URL in the snippet below in place of
`https://counter.syntagmata.com/count`.

## Add to the portfolio page

Drop this near the end of `<body>` in `index.html`. It fires once per page
load, fails silently if the request doesn't go through, and does nothing
visible on the page — it just counts.

```html
<script>
  fetch("https://counter.syntagmata.com/count").catch(() => {});
</script>
```

## Checking the count yourself

Visit `https://counter.syntagmata.com/count?peek=1` any time — the `peek=1`
means checking it won't count your own visit. Drop `?peek=1` from any URL
above if you ever want to test that a real increment works.

## Why a hash instead of the raw IP

The IP is read from Cloudflare's `CF-Connecting-IP` header, HMAC-hashed
with a secret salt in the same instant, and only the hash is ever written
to D1 or touches disk. The raw IP variable goes out of scope at the end of
that request and is never logged, stored, or returned in any response.
Cloudflare's own edge logs (outside this Worker's control) may retain
request metadata per its standard logging retention — this Worker's own
code and database never do.
