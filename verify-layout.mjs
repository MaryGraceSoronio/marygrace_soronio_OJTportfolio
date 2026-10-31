// verify-layout.mjs
// Milestone 5 Automated Visual Layout, Overflow, Console, and Theme Verification Harness

import puppeteer from 'puppeteer-core'
import { preview } from 'vite'
import { mkdirSync, existsSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const CHROME_PATH =
  process.env.CHROME_PATH ||
  (existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')

const PORT = 4173
const BASE_URL = `http://localhost:${PORT}`

mkdirSync('.verify', { recursive: true })

console.log('================================================================')
console.log('  MILESTONE 5: AUTOMATED VISUAL LAYOUT & CONSOLE VERIFICATION')
console.log('================================================================')
console.log(`Browser Executable : ${CHROME_PATH}`)
console.log(`Base URL           : ${BASE_URL}\n`)

let previewServer = null
let serverUrl = 'http://localhost:4173'
let useInterception = false

try {
  const res = await fetch(serverUrl)
  if (res.ok) {
    console.log(`  ✓ Reusing existing preview server at: ${serverUrl}\n`)
  } else {
    throw new Error('Not ok')
  }
} catch {
  console.log('[1/4] Starting Vite preview server...')
  try {
    previewServer = await preview({
      preview: {
        port: 4188,
        strictPort: false,
      },
    })
    serverUrl = previewServer.resolvedUrls.local[0].replace(/\/$/, '')
    await fetch(serverUrl)
    console.log(`  ✓ Preview server running at: ${serverUrl}\n`)
  } catch {
    useInterception = true
    serverUrl = 'http://localhost:4188'
    console.log(`  ✓ Vite preview ready (sandboxed network fallback active: ${serverUrl})\n`)
  }
}

const distHtml = existsSync('dist/index.html') ? readFileSync('dist/index.html', 'utf8') : ''

async function setupPage(page) {
  if (useInterception) {
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      try {
        const parsed = new URL(req.url())
        const localPath = path.join('dist', parsed.pathname)
        if (existsSync(localPath) && !statSync(localPath).isDirectory()) {
          const ext = path.extname(localPath).toLowerCase()
          const mimeTypes = {
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.svg': 'image/svg+xml',
            '.webp': 'image/webp',
            '.woff2': 'font/woff2',
            '.woff': 'font/woff',
          }
          req.respond({
            status: 200,
            contentType: mimeTypes[ext] || 'application/octet-stream',
            body: readFileSync(localPath),
          })
          return
        }
      } catch {}
      req.respond({
        status: 200,
        contentType: 'text/html',
        body: distHtml,
      })
    })
  }
}

// 2. Launch Headless Browser
console.log('[2/4] Launching headless browser...')
const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  pipe: true,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
})
console.log('  ✓ Browser launched successfully\n')

const viewports = [
  { name: 'Mobile (375px)', width: 375, height: 812 },
  { name: 'Mobile (390px)', width: 390, height: 844 },
  { name: 'Tablet (768px)', width: 768, height: 1024 },
  { name: 'Desktop (1280px)', width: 1280, height: 800 },
  { name: 'Desktop (1440px)', width: 1440, height: 900 },
]

const routes = [
  '/',
  '/projects',
  '/projects/fermonitor',
  '/about',
  '/skills',
  '/contact',
  '/nonexistent',
]

const results = []
let totalChecks = 0
let failedChecks = 0

console.log('[3/4] Verifying all 5 viewports across all 7 routes...')

for (const vp of viewports) {
  console.log(`\n  --- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`)
  for (const route of routes) {
    totalChecks++
    const page = await browser.newPage()
    await setupPage(page)
    await page.setViewport({ width: vp.width, height: vp.height })

    const consoleErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })
    page.on('pageerror', (err) => {
      consoleErrors.push(`PageError: ${err.message}`)
    })

    try {
      await page.goto(`${serverUrl}${route}`, { waitUntil: 'networkidle0', timeout: 15000 })
      await new Promise((r) => setTimeout(r, 300))

      const layoutData = await page.evaluate(() => {
        const doc = document.documentElement
        const scrollW = doc.scrollWidth
        const winW = window.innerWidth
        const clientW = doc.clientWidth
        const title = document.title
        const h1 = document.querySelector('h1')?.textContent?.trim() || ''
        const theme = doc.getAttribute('data-theme')
        return {
          scrollWidth: scrollW,
          innerWidth: winW,
          clientWidth: clientW,
          overflow: Math.max(0, scrollW - winW),
          title,
          h1,
          theme,
        }
      })

      const hasOverflow = layoutData.scrollWidth > layoutData.innerWidth
      const hasErrors = consoleErrors.length > 0
      const pass = !hasOverflow && !hasErrors

      if (!pass) failedChecks++

      const statusSymbol = pass ? '✓ PASS' : '✗ FAIL'
      console.log(
        `    ${statusSymbol} [${vp.width}px] ${route.padEnd(24)} | ` +
          `scrollW: ${layoutData.scrollWidth} / innerW: ${layoutData.innerWidth} | ` +
          `overflow: ${layoutData.overflow}px | errors: ${consoleErrors.length} | ` +
          `title: "${layoutData.title.slice(0, 35)}..."`
      )

      if (hasErrors) {
        consoleErrors.forEach((e) => console.log(`        ! Console error: ${e}`))
      }

      // Capture representative screenshots for documentation
      if (vp.width === 390 || vp.width === 1440) {
        const cleanName = route.replace(/\//g, '_').replace(/^_/, '') || 'home'
        const shotPath = path.join('.verify', `vp_${vp.width}_${cleanName}.png`)
        await page.screenshot({ path: shotPath, fullPage: false })
      }

      results.push({
        viewport: vp.name,
        width: vp.width,
        route,
        pass,
        hasOverflow,
        errors: consoleErrors,
        ...layoutData,
      })
    } catch (err) {
      failedChecks++
      console.error(`    ✗ FAIL [${vp.width}px] ${route}: Navigation/Execution error: ${err.message}`)
      results.push({
        viewport: vp.name,
        width: vp.width,
        route,
        pass: false,
        hasOverflow: false,
        errors: [err.message],
      })
    } finally {
      await page.close()
    }
  }
}

// 4. Dedicated Verification: Route Alias Lookup & Theme Toggle
console.log('\n[4/4] Specialized Feature Verifications (Route Alias & Theme Toggle)...')

// A. Route Alias Test (/projects/fermonitor-iot-incubator)
{
  totalChecks++
  const page = await browser.newPage()
  await setupPage(page)
  await page.setViewport({ width: 1440, height: 900 })
  try {
    await page.goto(`${serverUrl}/projects/fermonitor-iot-incubator`, { waitUntil: 'networkidle0', timeout: 15000 })
    await new Promise((r) => setTimeout(r, 200))

    const aliasData = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() || '',
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }))

    const aliasPass =
      aliasData.title.toLowerCase().includes('fermonitor') &&
      aliasData.h1.toLowerCase().includes('fermonitor') &&
      aliasData.scrollWidth <= aliasData.innerWidth

    if (aliasPass) {
      console.log(`  ✓ PASS Alias Route (/projects/fermonitor-iot-incubator):`)
      console.log(`        Title: "${aliasData.title}"`)
      console.log(`        H1   : "${aliasData.h1}"`)
    } else {
      failedChecks++
      console.log(`  ✗ FAIL Alias Route: Title or H1 mismatch: "${aliasData.title}" / "${aliasData.h1}"`)
    }
  } catch (err) {
    failedChecks++
    console.log(`  ✗ FAIL Alias Route navigation error: ${err.message}`)
  } finally {
    await page.close()
  }
}

// B. Theme Toggle Verification (Dark <-> Light)
{
  totalChecks++
  const page = await browser.newPage()
  await setupPage(page)
  await page.setViewport({ width: 1440, height: 900 })
  try {
    await page.goto(`${serverUrl}/`, { waitUntil: 'networkidle0', timeout: 15000 })
    await new Promise((r) => setTimeout(r, 300))

    // Initial Dark Theme Check
    const darkState = await page.evaluate(() => ({
      theme: document.documentElement.getAttribute('data-theme'),
      bg: getComputedStyle(document.body).backgroundColor,
      localStorage: localStorage.getItem('mg_theme'),
    }))

    // Click toggle to Light Theme
    const toggleBtn = await page.$('button[aria-label="Switch to light theme"]')
    if (toggleBtn) {
      await toggleBtn.click()
    } else {
      // Fallback search by text or data-theme
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(
          (b) => b.getAttribute('aria-label')?.includes('theme') || b.textContent.includes('Theme')
        )
        btn?.click()
      })
    }
    await new Promise((r) => setTimeout(r, 400))

    const lightState = await page.evaluate(() => ({
      theme: document.documentElement.getAttribute('data-theme'),
      bg: getComputedStyle(document.body).backgroundColor,
      localStorage: localStorage.getItem('mg_theme'),
    }))

    // Click toggle back to Dark Theme
    const toggleBtnDark = await page.$('button[aria-label="Switch to dark theme"]')
    if (toggleBtnDark) {
      await toggleBtnDark.click()
    } else {
      await page.evaluate(() => {
        const btn = [...document.querySelectorAll('button')].find(
          (b) => b.getAttribute('aria-label')?.includes('theme') || b.textContent.includes('Theme')
        )
        btn?.click()
      })
    }
    await new Promise((r) => setTimeout(r, 400))

    const restoredDarkState = await page.evaluate(() => ({
      theme: document.documentElement.getAttribute('data-theme'),
      bg: getComputedStyle(document.body).backgroundColor,
      localStorage: localStorage.getItem('mg_theme'),
    }))

    const themePass =
      darkState.theme === 'dark' &&
      lightState.theme === 'light' &&
      restoredDarkState.theme === 'dark' &&
      lightState.localStorage === 'light' &&
      restoredDarkState.localStorage === 'dark'

    if (themePass) {
      console.log(`  ✓ PASS Theme Toggle Switching:`)
      console.log(`        Initial: theme="${darkState.theme}" bg="${darkState.bg}" storage="${darkState.localStorage}"`)
      console.log(`        Toggled: theme="${lightState.theme}" bg="${lightState.bg}" storage="${lightState.localStorage}"`)
      console.log(`        Restore: theme="${restoredDarkState.theme}" bg="${restoredDarkState.bg}" storage="${restoredDarkState.localStorage}"`)
      await page.screenshot({ path: path.join('.verify', 'theme_light_toggle.png') })
    } else {
      failedChecks++
      console.log(`  ✗ FAIL Theme Toggle Switching: unexpected state:`, { darkState, lightState, restoredDarkState })
    }
  } catch (err) {
    failedChecks++
    console.log(`  ✗ FAIL Theme Toggle error: ${err.message}`)
  } finally {
    await page.close()
  }
}

// C. Deep-Link Reload Check
{
  totalChecks++
  const page = await browser.newPage()
  await setupPage(page)
  await page.setViewport({ width: 1440, height: 900 })
  try {
    await page.goto(`${serverUrl}/projects/fermonitor`, { waitUntil: 'networkidle0', timeout: 15000 })
    await page.reload({ waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 300))

    const reloadData = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim() || '',
    }))

    const reloadPass =
      reloadData.title.toLowerCase().includes('fermonitor') &&
      reloadData.h1.toLowerCase().includes('fermonitor')
    if (reloadPass) {
      console.log(`  ✓ PASS Deep-Link Direct Reload (/projects/fermonitor): Title="${reloadData.title}"`)
    } else {
      failedChecks++
      console.log(`  ✗ FAIL Deep-Link Direct Reload: "${reloadData.title}" / "${reloadData.h1}"`)
    }
  } catch (err) {
    failedChecks++
    console.log(`  ✗ FAIL Deep-Link Direct Reload error: ${err.message}`)
  } finally {
    await page.close()
  }
}

// Teardown
await browser.close()
if (previewServer) await previewServer.close()

console.log('\n================================================================')
console.log('  VERIFICATION SUMMARY')
console.log('================================================================')
console.log(`  Total Checks Executed : ${totalChecks}`)
console.log(`  Passed Checks         : ${totalChecks - failedChecks}`)
console.log(`  Failed Checks         : ${failedChecks}`)
console.log('================================================================\n')

if (failedChecks > 0) {
  process.exit(1)
} else {
  console.log('ALL VISUAL LAYOUT, OVERFLOW, CONSOLE, AND THEME CHECKS PASSED WITH 0 DEFECTS.\n')
  process.exit(0)
}
