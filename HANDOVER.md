# Where we got to

Last updated 2026-08-02.

## Done

- GitHub account switched from `forkalong-user` to **`wishbusterz`**.
  Git commit identity uses the private noreply address
  `311931348+wishbusterz@users.noreply.github.com`.
- Repo created and public: <https://github.com/wishbusterz/wishbusterz-web>
- Explored 21 visual directions, picked **04 Green Cascade** (Matrix).
- Built the real site with five iterations of that direction, plus
  canvas digital rain, hero typewriter, scramble-decode reveals and
  wish filtering. See README for the variant table.

## Decision waiting on Mate

**Which of the five iterations?** Open the site, press keys 1–5 or use
the switcher bottom-right:

1. Classic Cascade — full rain, maximum glow
2. Terminal Discipline — rain pulled back, built to be read
3. Red Pill — same cascade in warning red
4. White Rabbit — inverted, daylight, wiki-friendly
5. Deep Construct — cyan-teal, glass panels, depth

Recommendation if the wiki grows: **1 for the front page, 2 for the
wiki.** Full phosphor green is superb for a hero and tiring for long
how-to pages.

Once chosen, delete the preview switcher: the `.switch` markup in
`public/index.html`, the `.switch` rules in `public/assets/styles.css`,
and section 6 of `public/assets/main.js`.

## Live

**The site is deployed at <https://therustylamp.com>.**

- Worker `wishbusterz-web`, assets-only, on Mate's Cloudflare account.
- The apex domain is wired via `routes` in `wrangler.jsonc` with
  `custom_domain: true`, so Cloudflare manages the DNS record and the
  TLS certificate. The zone had no other DNS records.
- `wrangler login` is done; credentials live in
  `~/.config/.wrangler/config/default.toml`. Future deploys are just
  `npx wrangler deploy`.

Note for next time: the Cloudflare MCP tools are authenticated and
good for *inspecting* the account, but cannot deploy — the sandbox has
no filesystem access, can only reach `api.cloudflare.com`, and is not
allowed to mint API tokens. Use wrangler for anything that ships files.

No workers.dev subdomain was registered; the custom domain replaces it.

## Placeholder content to replace

- All social links are `#` — need the real YouTube handle and Twitch
  channel.
- The six wishes on the page are invented, as are the stats
  (31 granted / 16 busted).
- Wiki entries are titles only, with no pages behind them.
