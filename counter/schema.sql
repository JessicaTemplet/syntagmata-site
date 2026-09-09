-- Only the hash is stored, never the IP itself. The PRIMARY KEY constraint
-- is what makes "new IP" dedupe safe under concurrent requests — two visits
-- from the same IP arriving at the same instant can't both count as new.
CREATE TABLE IF NOT EXISTS visitors (
  ip_hash TEXT PRIMARY KEY,
  first_seen INTEGER NOT NULL
);
