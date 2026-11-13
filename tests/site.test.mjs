import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import { BRAND, CITIES } from '../data/site-data.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path), 'utf8');
const crawl = dir => readdirSync(join(root, dir), { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? crawl(join(dir, entry.name)) : entry.name === 'index.html' ? [join(dir, entry.name)] : []);
const files = ['index.html', ...crawl('services'), ...crawl('service-areas'), ...crawl('driveway-replacement')];
const pages = files.map(file => ({ file, html: read(file) }));
const decode = text => text.replace(/&amp;/g, '&');

test('paid driveway leads use their dedicated Make webhook', () => {
  const expected = 'https://hook.us2.make.com/rfn92i38h057afwomnibttrt0v0vhhtx';
  assert.equal(BRAND.drivewayLeadWebhook, expected);
  assert.ok(read('driveway-replacement/index.html').includes(`window.AZEB_LEAD_ENDPOINT=${JSON.stringify(expected)}`));
  assert.ok(read('services/concrete-driveways/index.html').includes(`window.AZEB_LEAD_ENDPOINT=${JSON.stringify(BRAND.leadWebhook)}`));
});

test('all public routes have one H1, unique titles, valid inline scripts and matching canonical URLs', () => {
  const titles = new Set();
  for (const { file, html } of pages) {
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, file);
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    assert.ok(title && !titles.has(title), file); titles.add(title);
    const route = '/' + file.replace(/index\.html$/, '').replaceAll('\\', '/');
    assert.ok(html.includes(`href="https://azelevatedbuilders.com${route}"`), file);
    for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (attrs.includes('application/ld+json')) JSON.parse(body);
      else new Script(body, { filename: file });
    }
  }
});

test('internal links, anchors and all responsive image candidates resolve', () => {
  for (const { file, html } of pages) {
    const urls = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => decode(m[1]));
    for (const [, set] of html.matchAll(/srcset="([^"]+)"/g)) urls.push(...set.split(',').map(c => decode(c.trim().split(/\s+/)[0])));
    for (const url of urls) {
      if (/^(https?:|tel:|mailto:|data:)/.test(url)) continue;
      if (url.startsWith('#')) {
        assert.ok(html.includes(`id="${url.slice(1)}"`), `${file}: ${url}`); continue;
      }
      const local = url.split(/[?#]/)[0];
      assert.ok(existsSync(resolve(root, '.' + local)), `${file}: ${url}`);
    }
  }
});

test('shared lead handler is loaded once per route with accessible fields and privacy links', () => {
  for (const { file, html } of pages) {
    assert.equal((html.match(/src="\/js\/leads\.js\?/g) || []).length, 1, file);
    assert.ok(/<form[^>]*data-lead/.test(html), file);
    assert.ok(html.includes('data-lead-status role="status"'), file);
    assert.ok(html.includes('class="lead-privacy"'), file);
    assert.ok(/<label for="(lead|dw)-phone">Phone number<\/label><input id="(lead|dw)-phone"/.test(html), file);
    assert.ok(html.includes('window.AZEB_LEAD_ENDPOINT='), file);
    assert.ok(!html.includes('function done(html)') && !html.includes('function finish(html)'), file);
  }
});

test('fingerprints reflect current CSS and shared interaction scripts', () => {
  for (const { file, html } of pages) {
    for (const [, asset, hash] of html.matchAll(/(?:href|src)="(\/(?:css|js)\/[^"?]+)\?v=([a-f0-9]+)"/g)) {
      const actual = createHash('sha1').update(readFileSync(join(root, asset.slice(1)))).digest('hex').slice(0, 8);
      assert.equal(hash, actual, `${file}: ${asset}`);
    }
  }
});

test('ad page stays crawlable but separate from the organic sitemap', () => {
  const sitemap = read('sitemap.xml');
  assert.ok(read('driveway-replacement/index.html').includes('content="noindex, follow"'));
  assert.ok(!sitemap.includes('/driveway-replacement/'));
  assert.ok(!read('robots.txt').includes('Disallow: /driveway-replacement'));
  assert.ok(!sitemap.includes('<lastmod>'));
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  assert.equal(new Set(urls).size, pages.length - 1);
});

test('stock imagery is not attributed to AZ and concrete photos use real responsive assets', () => {
  for (const { file, html } of pages) {
    assert.ok(!html.includes('by AZ Elevated Builders, serving'), file);
    if (file.includes('concrete-driveways/')) {
      // Real, finished-or-in-progress AZ concrete only; never the unfinished Walnut Creek front yard.
      assert.ok(!html.includes('walnut-creek-exterior__after-wide'), file);
      assert.ok(/page-img"><img src="\/assets\/projects\/(stamped-driveway__pattern-wide|walnut-creek-backyard__first-section-wide)-1200\.webp"/.test(html), file);
      assert.ok(/(stamped-driveway__pattern-wide|walnut-creek-backyard__first-section-wide)-480\.webp 480w/.test(html), file);
    }
  }
});

test('home FAQ structured data has matching visible questions and answers', () => {
  const html = read('index.html');
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  const faq = blocks.find(block => block['@type'] === 'FAQPage');
  const visible = decode(html.replace(/<script[\s\S]*?<\/script>/g, '')).replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
  for (const question of faq.mainEntity) {
    assert.ok(visible.includes(question.name));
    assert.ok(visible.includes(question.acceptedAnswer.text));
  }
});

test('ad landing page city suggestions and service schema match every website city', () => {
  const html = read('driveway-replacement/index.html');
  const options = [...html.matchAll(/<option value="([^"]+)"><\/option>/g)].map(match => match[1]).sort();
  assert.deepEqual(options, CITIES.map(city => city.name).sort());
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1]));
  const service = blocks.find(block => block['@type'] === 'Service');
  assert.deepEqual([...service.areaServed].sort(), CITIES.map(city => `${city.name}, CA`).sort());
});

test('every lead form carries the hidden honeypot, out of the tab order', () => {
  for (const { file, html } of pages) {
    const form = html.match(/<form[^>]*data-lead[\s\S]*?<\/form>/)?.[0] || '';
    assert.ok(/<div class="lead-hp" aria-hidden="true"><label>[^<]*<input type="text" name="azeb_check" tabindex="-1" autocomplete="off"><\/label><\/div>/.test(form), file);
  }
});

test('general estimate forms require the job, the place and the timing', () => {
  for (const { file, html } of pages.filter(p => !p.file.startsWith('driveway-replacement'))) {
    const form = html.match(/<form[^>]*data-lead[\s\S]*?<\/form>/)?.[0] || '';
    for (const re of [
      /<input id="lead-name" type="text" name="name"[^>]*required/, /<input id="lead-phone" type="tel" name="phone"[^>]*required/,
      /<input id="lead-email" type="email" name="email"[^>]*required/, /<input id="lead-city" type="text" name="city" list="lead-cities"[^>]*required/,
      /<select id="lead-service" name="service" required>/, /<select id="lead-timeline" name="timeline" required>/,
      /<textarea id="lead-details" name="details"[^>]*minlength="20"[^>]*required aria-describedby="lead-details-hint"/, /<span class="lead-hint" id="lead-details-hint">/,
    ]) assert.ok(re.test(form), `${file}: ${re}`);
    assert.ok(html.includes('<datalist id="lead-cities">'), file);
  }
});

test('landing pages arrive with the service and city they are about', () => {
  for (const city of CITIES.slice(0, 5)) {
    const html = read(`service-areas/${city.slug}/kitchen-remodeling/index.html`);
    assert.ok(html.includes('<option selected>Kitchen Remodeling</option>'), city.slug);
    assert.ok(decode(html).includes(`name="city" list="lead-cities" maxlength="100" placeholder="Start typing your city" required autocomplete="address-level2" value="${city.name}"`), city.slug);
  }
  assert.ok(read('index.html').includes('<option value="" selected>Choose one</option><option>Kitchen Remodeling</option>'));
});

test('lead script screens bots before anything is sent and tags real leads', () => {
  const js = read('js/leads.js');
  assert.ok(js.includes('const FORM_VERSION = "2"'));
  assert.ok(/v: FORM_VERSION, elapsed:/.test(js));
  assert.ok(js.includes('performance.now() - (firstTouch ?? pageStart)'));
  const trap = js.indexOf('if (trap && trap.value) { quietlyAccept(); return; }');
  const timing = js.indexOf('if (elapsed < MIN_FILL_MS)');
  const send = js.indexOf('await fetch(endpoint');
  assert.ok(trap > 0 && timing > trap && send > timing);
});

test('every service and city page has a working phone menu, and the homepage menu can scroll', () => {
  for (const { file, html } of pages.filter(p => !p.file.startsWith('driveway-replacement') && p.file !== 'index.html')) {
    assert.ok(html.includes('<button class="nav__menu" id="menuBtn" type="button" aria-controls="menu"'), file);
    assert.ok(/<div class="menu" id="menu" aria-hidden="true" inert>/.test(html), file);
    assert.ok(/src="\/js\/nav\.js\?v=[a-f0-9]{8}"/.test(html), file);
  }
  const home = read('index.html');
  assert.ok(home.includes('<div class="menu" id="menu" data-lenis-prevent'));
  assert.ok(home.includes('<div class="modal" id="contactModal" data-lenis-prevent'));
});

test('generated copy uses written service phrases, not lower-cased titles', () => {
  for (const { file, html } of pages) {
    const text = html.replace(/<[^>]+>/g, ' ');
    assert.ok(!/ & adus|provides concrete & driveways|offers interior & exterior painting/.test(text), file);
    assert.ok(!/older the East Bay|the East Bay processes|existing the East Bay/i.test(text), file);
    assert.ok(!/Our finish carpenters|Steam shower design/.test(text), file);
  }
});

test('custom 404 page exists, is noindex and is not in the sitemap', () => {
  const html = read('404.html');
  assert.ok(html.includes('<meta name="robots" content="noindex, follow"'));
  assert.ok(html.includes('That page<br><em>isn'));
  assert.ok(!read('sitemap.xml').includes('404'));
});

test('no internal notes about the sign or missing photos in public page source', () => {
  const home = read('index.html');
  assert.ok(!/does not exist|No before\/after pair|captions say only what is visible|not yet confirmed|one sink|11066795/.test(home));
});

test('no page advertises that the contractor is bonded or insured (CSLB advertising rules; insurance unconfirmed)', () => {
  // CSLB Advertising Guidelines: "The law prevents you from noting in your
  // advertising or any presentation to the public that you are bonded."
  // (B&P 7071.13, 7027.4(b)). Liability insurance is not confirmed either.
  const rootPages = readdirSync(root).filter(f => f.endsWith('.html')).map(file => ({ file, html: read(file) }));
  for (const { file, html } of [...pages, ...rootPages, { file: 'llms.txt', html: read('llms.txt') }]) {
    const text = html.replace(/<[^>]+>/g, ' ');
    assert.ok(!/\bbonded\b/i.test(text), `${file}: bonded`);
    assert.ok(!/\binsured\b/i.test(text), `${file}: insured`);
  }
});
