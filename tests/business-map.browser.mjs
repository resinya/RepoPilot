// Optional development check: node tests/business-map.browser.mjs <playwright-module-path>
// No browser package is a Skill runtime dependency.
import assert from 'node:assert/strict';
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.argv[2] || 'playwright');
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const template = resolve(root, 'skills/repo-pilot/assets/templates/business-map.html');
const html = readFileSync(template, 'utf8');
const payload = /(<script id="rp-data" type="application\/json">)([\s\S]*?)(<\/script>)/;
const base = JSON.parse(html.match(payload)[2]);
const withData = data => html.replace(payload, (_all, open, _data, close) =>
  open + JSON.stringify(data).replaceAll('<', '\\u003c') + close);
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
  await page.goto(pathToFileURL(template).href);
  assert.equal(await page.locator('#flow-content .flow-step').count(), 4);
  assert.equal(await page.locator('#module-content .module').count(), 7);
  // Reading the complete scene must require no click or mode change.
  for (const step of base.scenarios[0].steps) {
    await page.getByRole('heading', { name: step.name, exact: false }).waitFor();
  }
  assert.equal(await page.locator('#flow-content .flow-step').evaluateAll(steps =>
    steps.every(step => getComputedStyle(step).display !== 'none' && !step.closest('details'))), true);
  await page.locator('#step-nav a').last().click();
  await page.waitForFunction(() => document.activeElement.id === 'step-3');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'step-3');
  await page.reload();
  await page.waitForFunction(() => document.activeElement.id === 'step-3');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'step-3');
  const detail = page.locator('#step-3 details').first();
  await detail.locator('summary').click();
  assert.equal(await detail.getAttribute('open'), '');
  assert.equal(await page.locator('#sequence-diagram svg').count(), 1);
  assert.equal(await page.locator('#sequence-diagram .message-link').count(), 6);
  assert.equal(await page.locator('#flow-content pre').count(), 6);
  await page.getByRole('button', { name: '上一阶段', exact: true }).click();
  assert.equal(await page.locator('#step-2').getAttribute('data-current'), 'true');
  assert.equal(await page.locator('#flow-content .flow-step').count(), 4);
  await page.getByRole('button', { name: '下一阶段', exact: true }).click();
  assert.equal(await page.locator('#step-3').getAttribute('data-current'), 'true');
  const output = resolve(root, '.workbuddy/repopilot-v05-check');
  mkdirSync(output, { recursive: true });
  await page.locator('a[href="#modules"]').click();
  await page.screenshot({ path: resolve(output, 'business-map-desktop.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({ path: resolve(output, 'business-map-mobile.png') });

  // Multi-scenario use keeps every step in the selected scene visible.
  const multi = structuredClone(base);
  multi.scenarios.push({ id: 'other', name: '另一合成场景', steps: [
    { ...multi.scenarios[0].steps[0], name: '另一场景步骤' },
  ] });
  await page.goto('about:blank');
  await page.setContent(withData(multi));
  await page.locator('#scenario').selectOption('other');
  assert.equal(await page.locator('#flow-content .flow-step').count(), 1);
  await page.getByRole('heading', { name: '1. 另一场景步骤', exact: true }).waitFor();
  await page.locator('#scenario').selectOption('list');
  assert.equal(await page.locator('#flow-content .flow-step').count(), 4);
  await page.evaluate(() => { location.hash = 'scenario=unavailable&section=step-999'; });
  await page.waitForFunction(() => document.querySelector('#scenario').value === 'list');
  assert.equal(await page.locator('#flow-content .flow-step').count(), 4);

  // Treat source-derived names as text, stop structural cycles, handle missing/empty evidence.
  const edge = structuredClone(base);
  edge.nodes[0].name = '<img src=x onerror="window.injected=true">';
  edge.nodes[0].children.push('system', 'missing');
  edge.scenarios = [];
  await page.goto('about:blank');
  await page.setContent(withData(edge));
  assert.equal(await page.locator('#module-content img').count(), 0);
  assert.equal(await page.evaluate(() => window.injected), undefined);
  await page.getByText('不重复展开循环关系', { exact: false }).waitFor();
  await page.getByText('模块 missing 缺少资料。', { exact: true }).waitFor();
  await page.getByText('当前证据没有可确认的流程步骤，暂未补造。', { exact: true }).waitFor();
  edge.scenarios = [{ id: 'empty', name: '空场景', steps: [] }];
  await page.setContent(withData(edge));
  assert.equal(await page.locator('#flow-content .flow-step').count(), 0);
  assert.deepEqual(errors, []);
  assert.deepEqual(requests, []);
  console.log('Business map: concentrated reading, anchors/reload, evidence, mobile, scenarios, safe text, cycles and empty flows passed.');
} finally {
  await browser.close();
}
