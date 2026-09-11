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
    assert.ok(html.includes('<label class="lead-field">Phone number'), file);
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
      assert.ok(html.includes('src="/assets/projects/walnut-creek-exterior__after-wide-1600.webp"'), file);
      assert.ok(html.includes('after-wide-480.webp 480w'), file);
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

test('ad landing page coverage, city suggestions and service schema match every website city', () => {
  const html = read('driveway-replacement/index.html');
  const visible = [...html.matchAll(/data-service-city="([^"]+)"/g)].map(match => match[1]).sort();
  assert.deepEqual(visible, CITIES.map(city => city.slug).sort());
  const options = [...html.matchAll(/<option value="([^"]+)"><\/option>/g)].map(match => match[1]).sort();
  assert.deepEqual(options, CITIES.map(city => city.name).sort());
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match => JSON.parse(match[1]));
  const service = blocks.find(block => block['@type'] === 'Service');
  assert.deepEqual([...service.areaServed].sort(), CITIES.map(city => `${city.name}, CA`).sort());
});
