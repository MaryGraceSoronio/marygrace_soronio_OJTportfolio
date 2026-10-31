import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const base = process.env.BASE || 'http://localhost:4173'
mkdirSync('.verify', { recursive: true })

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
})

const results = []
const routes = [
  '/',
  '/projects',
  '/projects/fermonitor',
  '/projects/rtthread-hmi',
  '/about',
  '/skills',
  '/contact',
  '/nope',
]
const viewports = [
  [375, 812, true],
  [768, 1024, false],
  [1280, 800, false],
  [1440, 900, true],
  [1920, 1080, true],
]

for (const [width, height, shots] of viewports) {
  for (const route of routes) {
    const page = await browser.newPage()
    await page.setViewport({ width, height })
    const errors = []
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
    page.on('requestfailed', (r) => errors.push(`failed: ${r.url()} ${r.failure()?.errorText}`))

    await page.goto(base + route, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 350))

    if (shots) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      await new Promise((r) => setTimeout(r, 900))
      await page.evaluate(() => window.scrollTo(0, 0))
      await new Promise((r) => setTimeout(r, 250))
    }

    // Force every capture to load so the broken-image check is honest.
    await page.evaluate(() => {
      document.querySelectorAll('img').forEach((img) => {
        img.loading = 'eager'
      })
    })
    await new Promise((r) => setTimeout(r, 1200))

    const info = await page.evaluate(() => {
      const doc = document.documentElement
      const images = [...document.images].map((img) => ({
        src: img.currentSrc.split('/').pop(),
        ok: img.complete && img.naturalWidth > 0,
      }))
      const h1 = document.querySelector('h1')?.innerText || ''
      const heroTop = document.querySelector('h1')?.getBoundingClientRect().top
      return {
        overflow: doc.scrollWidth - doc.clientWidth,
        height: doc.scrollHeight,
        h1,
        heroTop: heroTop == null ? null : Math.round(heroTop),
        broken: images.filter((i) => !i.ok),
        theme: doc.getAttribute('data-theme'),
        searchWidth:
          document.getElementById('build-search')?.getBoundingClientRect().width ?? null,
      }
    })

    results.push({ route, width, errors, ...info })

    if (shots) {
      const name = `${width}${route.replace(/\//g, '-') || '-home'}.png`
      await page.screenshot({ path: `.verify/${name}`, fullPage: false })
    }
    await page.close()
  }
}

// Refresh on a deep route
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(base + '/projects/fermonitor', { waitUntil: 'networkidle0' })
  await page.reload({ waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 400))
  const out = await page.evaluate(() => ({
    path: window.location.pathname,
    h1: document.querySelector('h1')?.innerText,
  }))
  results.push({ route: 'deep-refresh', width: 1440, errors: [], ...out })
  await page.close()
}

// Theme toggle
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(base + '/', { waitUntil: 'networkidle0' })
  await page.click('button[aria-label="Switch to light theme"]')
  await new Promise((r) => setTimeout(r, 400))
  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  await page.screenshot({ path: '.verify/1440-home-light.png' })
  results.push({ route: 'theme-toggle', width: 1440, errors: [], theme, bg })
  await page.close()
}

// Mobile drawer
{
  const page = await browser.newPage()
  await page.setViewport({ width: 375, height: 812 })
  await page.goto(base + '/', { waitUntil: 'networkidle0' })
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Menu')
    btn?.click()
  })
  await new Promise((r) => setTimeout(r, 350))
  const state = await page.evaluate(() => {
    const panel = document.getElementById('mobile-navigation')
    return {
      hidden: panel?.hidden,
      panelHeight: panel ? Math.round(panel.getBoundingClientRect().height) : null,
      links: panel ? [...panel.querySelectorAll('a')].map((a) => a.textContent.trim()).slice(0, 6) : [],
      bodyOverflow: document.body.style.overflow,
    }
  })
  await page.screenshot({ path: '.verify/375-home-drawer.png' })
  results.push({ route: 'mobile-drawer', width: 375, errors: [], ...state })
  await page.close()
}

// Card to detail navigation
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })
  await page.goto(base + '/projects', { waitUntil: 'networkidle0' })
  await page.evaluate(() => {
    document.querySelector('a[href^="/projects/"]')?.click()
  })
  await new Promise((r) => setTimeout(r, 600))
  const out = await page.evaluate(() => ({
    path: window.location.pathname,
    h1: document.querySelector('h1')?.innerText,
  }))
  results.push({ route: 'card-navigation', width: 1440, errors: [], ...out })
  await page.close()
}

await browser.close()

for (const r of results) {
  const flag = r.errors?.length || r.overflow > 0 || r.broken?.length ? 'FAIL' : 'ok  '
  console.log(
    `${flag} ${String(r.width).padEnd(4)} ${String(r.route).padEnd(26)} ` +
      `overflow=${r.overflow ?? '-'} heroTop=${r.heroTop ?? '-'} search=${r.searchWidth ? Math.round(r.searchWidth) : '-'} ` +
      `broken=${r.broken?.length ?? '-'} theme=${r.theme ?? '-'} h1="${(r.h1 || '').slice(0, 34)}"`,
  )
  if (r.errors?.length) r.errors.slice(0, 4).forEach((e) => console.log('      ! ' + e.slice(0, 160)))
  if (r.broken?.length) r.broken.slice(0, 6).forEach((b) => console.log('      x ' + b.src))
  if (r.route === 'theme-toggle') console.log('      bg=' + r.bg)
  if (r.route === 'mobile-drawer')
    console.log('      hidden=' + r.hidden + ' h=' + r.panelHeight + ' body=' + r.bodyOverflow)
  if (r.route === 'card-navigation' || r.route === 'deep-refresh')
    console.log('      path=' + r.path + ' h1=' + r.h1)
}
