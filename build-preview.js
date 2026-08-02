/* Bundles index.html + assets into one self-contained file for
   sharing as a preview link. The real site stays split across
   index.html / assets/styles.css / assets/main.js. */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "assets/styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "assets/main.js"), "utf8");

const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, "Wishbusterz"])[1];
const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [, ""])[1]
  .replace(/<script src="\.\/assets\/main\.js"><\/script>/, "");

const out = [
  `<title>${title}</title>`,
  `<script>document.documentElement.setAttribute("data-variant","classic");</script>`,
  `<style>\n${css}\n</style>`,
  body.trim(),
  `<script>\n${js}\n</script>`,
  ""
].join("\n");

const dest = process.argv[2] || path.join(root, "preview.html");
fs.writeFileSync(dest, out);
console.log(`built ${dest} — ${(out.length / 1024).toFixed(1)} kB`);
