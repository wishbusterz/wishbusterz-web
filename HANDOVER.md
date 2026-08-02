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

## Blocked

**Cloudflare deploy.** Everything is configured (`wrangler.jsonc`,
site in `public/`), but this machine has no Cloudflare credentials.
Mate needs to run, in the terminal:

```
npx wrangler login
```

Confirm with `npx wrangler whoami` — it should print an account, not
"You are not authenticated". Then `npx wrangler deploy` puts it live at
`wishbusterz-web.<subdomain>.workers.dev`.

Note: logging into the Cloudflare website is **not** the same thing.
The command must run in the terminal on this machine.

Open question: is **wishbusterz.com** on the same Cloudflare account?
If so the site can point there instead of a workers.dev subdomain.

## Placeholder content to replace

- All social links are `#` — need the real YouTube handle and Twitch
  channel.
- The six wishes on the page are invented, as are the stats
  (31 granted / 16 busted).
- Wiki entries are titles only, with no pages behind them.
