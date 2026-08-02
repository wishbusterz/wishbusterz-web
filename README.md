# wishbusterz-web

The website for **Wishbusterz**.

## The idea

Someone has a wish. We find out whether AI can solve it. If it can, we
build it — and open-source it so anyone can use it and play with it.
If it can't, we say so on camera. Those wishes get **busted**.

## Where the channel lives

- YouTube — the finished builds
- Twitch — live, unedited
- Facebook — planned

## Running it

It's a plain static site — no build step, no dependencies. Open
`index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Layout

```
index.html           the whole page
assets/styles.css    tokens + components
assets/main.js       rain canvas, typewriter, reveals, filters
build-preview.js     bundles the above into one shareable file
```

## Design

Direction: **Green Cascade** (Matrix). Five iterations are built in and
switched by the `data-variant` attribute on `<html>`:

| `data-variant` | Name                | Character                          |
| -------------- | ------------------- | ---------------------------------- |
| `classic`      | Classic Cascade     | Full rain, maximum glow            |
| `terminal`     | Terminal Discipline | Rain pulled back, built to be read |
| `redpill`      | Red Pill            | Same cascade in warning red        |
| `rabbit`       | White Rabbit        | Inverted, daylight, wiki-friendly  |
| `construct`    | Deep Construct      | Cyan-teal, glass panels, depth     |

The floating style switcher in the corner is **preview only**. Once a
variant is chosen, delete the `.switch` markup in `index.html`, the
`.switch` rules in `styles.css`, and section 6 of `main.js`.

Every component reads CSS custom properties and never hard-codes a
colour, so a variant is defined entirely by its token block.

## Still to do

- Real YouTube / Twitch / GitHub URLs (currently `#`)
- Real wishes — the six on the page are placeholders
- Wiki articles are titles only, no pages behind them

## Status

Design review. Five iterations live; no variant chosen yet.
