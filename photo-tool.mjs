#!/usr/bin/env node
/**
 * AZ Elevated Builders — photo finalizer.
 *
 * Turns a raw client photo drop into web-ready, EXIF-stripped, responsive
 * project images without anyone opening Photoshop.
 *
 *   node photo-tool.mjs scan  <folder>   # build a visual picker
 *   node photo-tool.mjs build            # process everything you kept
 *
 * scan  → reads <folder> recursively, makes thumbnails, writes
 *         .photo-tool/picker.html. Open it, click the keepers, name the
 *         project, hit Export — it downloads picks.json.
 * build → reads .photo-tool/picks.json and writes assets/projects/
 *         at 480/800/1200/1600 with all EXIF (incl. GPS) removed.
 *
 * Requires: sips (macOS, built in). No dependencies.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname, basename, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = dirname(fileURLToPath(import.meta.url));
const WORK = join(ROOT, ".photo-tool");
const THUMBS = join(WORK, "thumbs");
const DEST = join(ROOT, "assets", "projects");
const WIDTHS = [480, 800, 1200, 1600];
const IMG = /\.(jpe?g|png|heic)$/i;

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (IMG.test(e) && st.size > 40_000) out.push(p);
  }
  return out;
};

const sips = (args) => {
  try { return execFileSync("sips", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); }
  catch { return ""; }
};

const dims = (f) => {
  const o = sips(["-g", "pixelWidth", "-g", "pixelHeight", f]);
  const w = +(o.match(/pixelWidth:\s*(\d+)/)?.[1] || 0);
  const h = +(o.match(/pixelHeight:\s*(\d+)/)?.[1] || 0);
  return { w, h };
};

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/* ---------------------------------- scan --------------------------------- */
function scan(src) {
  if (!src || !existsSync(src)) { console.error("Usage: node photo-tool.mjs scan <folder>"); process.exit(1); }
  mkdirSync(THUMBS, { recursive: true });
  const files = walk(src);
  console.log(`found ${files.length} images, building thumbnails…`);

  const items = [];
  files.forEach((f, i) => {
    const id = String(i).padStart(4, "0");
    const thumb = join(THUMBS, `${id}.jpg`);
    if (!existsSync(thumb)) sips(["-Z", "560", f, "--out", thumb]);
    const { w, h } = dims(f);
    items.push({
      id, src: f,
      rel: relative(src, f),
      folder: relative(src, dirname(f)) || ".",
      thumb: `thumbs/${id}.jpg`,
      w, h, orient: w > h ? "landscape" : "portrait",
    });
    if (i % 25 === 0) process.stdout.write(`\r  ${i}/${files.length}`);
  });
  process.stdout.write(`\r  ${files.length}/${files.length}\n`);

  const folders = [...new Set(items.map((i) => i.folder))].sort();
  writeFileSync(join(WORK, "items.json"), JSON.stringify(items, null, 1));
  writeFileSync(join(WORK, "picker.html"), picker(items, folders, src));
  console.log(`\nOpen this to choose photos:\n  file://${join(WORK, "picker.html")}\n`);
}

/* --------------------------------- build --------------------------------- */
function build() {
  const picksPath = join(WORK, "picks.json");
  if (!existsSync(picksPath)) {
    console.error("No picks.json. Run `scan` first, choose photos, then save the\n" +
                  "exported picks.json into .photo-tool/");
    process.exit(1);
  }
  const picks = JSON.parse(readFileSync(picksPath, "utf8"));
  mkdirSync(DEST, { recursive: true });
  let made = 0;

  for (const p of picks) {
    const project = slug(p.project || "project");
    const name = slug(p.name || basename(p.src, extname(p.src)));
    const { w: sw } = dims(p.src);
    for (const width of WIDTHS) {
      if (sw && sw < width && width !== WIDTHS[0]) continue;
      const out = join(DEST, `${project}__${name}-${width}.jpg`);
      // sips re-encodes and drops the original EXIF block, so GPS coordinates
      // of the client's home never reach the web server.
      sips(["-s", "format", "jpeg", "-s", "formatOptions", "78",
            "-Z", String(width), p.src, "--out", out]);
      sips(["-d", "all", out]);   // belt and braces: strip any residual metadata
      made++;
    }
  }
  console.log(`wrote ${made} variants for ${picks.length} photos -> assets/projects/`);
  console.log("Reference them as /assets/projects/<project>__<name>-800.jpg");
}

/* --------------------------------- picker -------------------------------- */
const picker = (items, folders, src, opt = {}) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>${opt.client ? "Choose your photos — AZ Elevated Builders" : "Photo finalizer — AZ Elevated Builders"}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font:14px/1.5 -apple-system,system-ui,sans-serif;background:#14161c;color:#eee}
header{position:sticky;top:0;z-index:10;background:#0d0f14;border-bottom:1px solid #262a33;
  padding:12px 18px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}
h1{font-size:15px;font-weight:700;letter-spacing:.02em}
.sp{flex:1}
select,input,button{font:inherit;background:#1c2029;color:#eee;border:1px solid #2f3540;
  padding:8px 12px;border-radius:6px}
button{cursor:pointer;background:#C8A96A;color:#14161c;border-color:#C8A96A;font-weight:700}
button.ghost{background:transparent;color:#eee;border-color:#2f3540;font-weight:500}
.count{font-size:12px;color:#8b93a7}
main{padding:14px;display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:10px}
figure{position:relative;background:#1c2029;border:2px solid transparent;border-radius:8px;
  overflow:hidden;cursor:pointer}
figure.on{border-color:#C8A96A}
figure img{width:100%;aspect-ratio:3/4;object-fit:cover;display:block}
figcaption{padding:6px 8px;font-size:11px;color:#8b93a7;display:flex;justify-content:space-between;gap:6px}
.tick{position:absolute;top:8px;right:8px;width:26px;height:26px;border-radius:50%;
  background:rgba(0,0,0,.55);display:grid;place-items:center;font-size:14px;color:#fff}
figure.on .tick{background:#C8A96A;color:#14161c}
.nm{position:absolute;left:0;right:0;bottom:26px;padding:6px;background:rgba(0,0,0,.75);display:none}
figure.on .nm{display:block}
.nm input{width:100%;font-size:11px;padding:4px 6px}
</style></head><body>
<header>
  <h1>${opt.client ? "Choose your photos" : "Photo finalizer"}</h1>
  <select id="folder"><option value="">All folders (${items.length})</option>
    ${folders.map((f) => `<option value="${f}">${f}</option>`).join("")}</select>
  <select id="orient"><option value="">Any orientation</option>
    <option value="landscape">Landscape</option><option value="portrait">Portrait</option></select>
  ${opt.client ? "" : '<input id="project" placeholder="Project slug e.g. oakland-kitchen" style="min-width:230px">'}
  <span class="sp"></span>
  <span class="count" id="count">0 selected</span>
  <button class="ghost" id="clear">Clear</button>
  <button id="export">${opt.client ? "Send my picks" : "Export picks.json"}</button>
</header>
${opt.client ? '<p style="padding:14px 18px 0;color:#8b93a7;max-width:70ch">Tap every photo you are happy for us to put on the website. Pick as many as you like — we will crop, resize and optimise them. When you are done, press <b style="color:#C8A96A">Send my picks</b>.</p>' : ""}
<main id="grid"></main>
<script>
const ITEMS = ${JSON.stringify(items)};
const SRC = ${JSON.stringify(src)};\nconst CLIENT = ${JSON.stringify(!!opt.client)};\nconst LABEL = ${JSON.stringify(opt.label || "")};
const picked = new Map();
const grid = document.getElementById('grid');
const countEl = document.getElementById('count');

function render(){
  const f = document.getElementById('folder').value;
  const o = document.getElementById('orient').value;
  grid.innerHTML = '';
  ITEMS.filter(i => (!f || i.folder === f) && (!o || i.orient === o)).forEach(i => {
    const fig = document.createElement('figure');
    fig.className = picked.has(i.id) ? 'on' : '';
    fig.innerHTML =
      '<img loading="lazy" src="' + i.thumb + '">' +
      '<div class="tick">' + (picked.has(i.id) ? '✓' : '') + '</div>' +
      (CLIENT ? '' : '<div class="nm"><input placeholder="name e.g. kitchen-wide" value="' +
        (picked.get(i.id)?.name || '') + '"></div>') +
      '<figcaption><span>' + i.folder + '</span><span>' + i.w + '×' + i.h + '</span></figcaption>';
    fig.querySelector('img').onclick = () => {
      if (picked.has(i.id)) picked.delete(i.id);
      else picked.set(i.id, { ...i, name: '' });
      render();
    };
    const nameInput = fig.querySelector('.nm input');
    if (nameInput) nameInput.oninput = e => {
      const p = picked.get(i.id); if (p) p.name = e.target.value;
    };
    grid.appendChild(fig);
  });
  countEl.textContent = picked.size + ' selected';
}
document.getElementById('folder').onchange = render;
document.getElementById('orient').onchange = render;
document.getElementById('clear').onclick = () => { picked.clear(); render(); };
document.getElementById('export').onclick = () => {
  const el = document.getElementById('project');
  const project = CLIENT ? (LABEL || 'client-picks') : (el ? el.value.trim() : '');
  if (!project) { alert('Give the project a slug first — e.g. oakland-kitchen'); return; }
  if (!picked.size) { alert('Pick some photos first.'); return; }
  const out = [...picked.values()].map((p, n) => ({
    src: p.src, project,
    name: (p.name || '').trim() || ('shot-' + String(n + 1).padStart(2, '0'))
  }));
  const blob = new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'picks.json'; a.click();
  alert(CLIENT
    ? 'Thanks! A file called picks.json just downloaded.\\n\\nPlease email that file back to us and we will do the rest.'
    : 'Saved picks.json — move it into .photo-tool/ then run:\\n\\n  node photo-tool.mjs build');
};
render();
</script></body></html>`;

/* --------------------------------- share ---------------------------------
   Bundles the picker into ONE self-contained .html with the thumbnails
   inlined as data URIs, so it can be emailed or dropped in Drive and opened
   by the client on any machine with no server and no folder of images.
-------------------------------------------------------------------------- */
function share(label) {
  const itemsPath = join(WORK, "items.json");
  if (!existsSync(itemsPath)) { console.error("Run `scan <folder>` first."); process.exit(1); }
  const items = JSON.parse(readFileSync(itemsPath, "utf8"));
  const small = join(WORK, "share");
  mkdirSync(small, { recursive: true });

  console.log(`inlining ${items.length} thumbnails…`);
  const inlined = items.map((it, i) => {
    const sm = join(small, `${it.id}.jpg`);
    if (!existsSync(sm)) {
      sips(["-s", "format", "jpeg", "-s", "formatOptions", "66", "-Z", "400",
            join(WORK, it.thumb), "--out", sm]);
    }
    if (i % 25 === 0) process.stdout.write(`\r  ${i}/${items.length}`);
    const b64 = existsSync(sm) ? readFileSync(sm).toString("base64") : "";
    return { ...it, thumb: `data:image/jpeg;base64,${b64}` };
  });
  process.stdout.write(`\r  ${items.length}/${items.length}\n`);

  const folders = [...new Set(items.map((i) => i.folder))].sort();
  const html = picker(inlined, folders, "", { client: true, label: label || "" });
  const out = join(ROOT, "Photo-Selection-AZ-Elevated-Builders.html");
  writeFileSync(out, html);
  const mb = (statSync(out).size / 1048576).toFixed(1);
  console.log(`\nSend this one file to the client (${mb} MB):\n  ${out}\n`);
  console.log("They tick the photos they want and press Send — it downloads a small");
  console.log("picks.json they email back. Drop that into .photo-tool/ and run:\n");
  console.log("  node photo-tool.mjs build\n");
}

/* ---------------------------------- cli ---------------------------------- */
const [cmd, arg] = process.argv.slice(2);
if (cmd === "scan") scan(arg);
else if (cmd === "share") share(arg);
else if (cmd === "build") build();
else {
  console.log(`AZ Elevated Builders — photo finalizer

  node photo-tool.mjs scan <folder>   scan a photo drop and open the picker
  node photo-tool.mjs build           process the photos you kept

Output lands in assets/projects/ at 480/800/1200/1600px with EXIF stripped.`);
}
