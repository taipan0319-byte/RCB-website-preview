import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const read = (path, encoding = 'utf8') => readFile(new URL(path, root), encoding);

let html = await read('index.html');
const css = await read('styles.css');
const js = await read('script.js');
const svg = await read('assets/rcb-mark.svg');
const image = await read('assets/signal-fallback.svg');

const svgData = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
const imageData = `data:image/svg+xml;base64,${Buffer.from(image).toString('base64')}`;

html = html
  .replace('<link rel="stylesheet" href="styles.css">', `<style>${css}</style>`)
  .replace('<script src="script.js"></script>', `<script>${js.replaceAll('</script>', '<\\/script>')}</script>`)
  .replaceAll('assets/rcb-mark.svg', svgData)
  .replace('assets/signal-fallback.svg', imageData);

const worker = `const page = ${JSON.stringify(html)};
const robots = "User-agent: *\\nDisallow: /\\n";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const headers = {
      "Cache-Control": "public, max-age=300",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    };
    if (url.pathname === "/robots.txt") {
      return new Response(robots, { headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" } });
    }
    return new Response(page, { headers: { ...headers, "Content-Type": "text/html; charset=utf-8" } });
  }
};
`;

await rm(new URL('dist/', root), { recursive: true, force: true });
await mkdir(new URL('dist/server/', root), { recursive: true });
await mkdir(new URL('dist/.openai/', root), { recursive: true });
await writeFile(new URL('dist/server/index.js', root), worker);
await writeFile(new URL('dist/.openai/hosting.json', root), await read('.openai/hosting.json'));

console.log('Production worker written to dist/server/index.js');
