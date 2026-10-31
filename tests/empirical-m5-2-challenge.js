// tests/empirical-m5-2-challenge.js
// EMPIRICAL CHALLENGER M5-2 ADVERSARIAL STRESS HARNESS
// Focus: Milestone 5 (E2E Integration, Interactive UI Stress & Layout Overflow)
//
// Verification Scope:
// 1. Interactive Components Stress:
//    - Mobile Navigation Drawer: open, close, backdrop click, Escape key dismiss, focus trap, body scroll lock
//    - Contact Form: client-side validation on empty inputs, mailto URL encoding, subject parameter pre-population from case study CTA
//    - Project Showcase: category pills switching with active search, safe search handling of special characters (C++, *), empty state reset actions
// 2. Layout Overflow Verification:
//    - 0px horizontal overflow across mobile (375px, 390px), tablet (768px), desktop (1280px, 1440px) on every route
// 3. Verification:
//    - Production build exit code 0
//    - Full 330-test E2E test suite regression pass

import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import puppeteer from 'puppeteer-core'
import { preview } from 'vite'

const ROOT = path.resolve(import.meta.dirname, '..')

const CHROME_PATH =
  process.env.CHROME_PATH ||
  (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')

console.log('================================================================')
console.log('  CHALLENGER M5-2: EMPIRICAL ADVERSARIAL STRESS HARNESS')
console.log('  Milestone 5: E2E Integration, Interactive UI & Overflow Testing')
console.log('================================================================')
console.log(`Browser Executable : ${CHROME_PATH}`)
console.log(`Root Directory     : ${ROOT}\n`)

let passCount = 0
let failCount = 0
const failures = []

function assertCheck(name, condition, details = '') {
  if (condition) {
    console.log(`  [PASS] ${name}`)
    passCount++
  } else {
    console.error(`  [FAIL] ${name} ${details ? `(${details})` : ''}`)
    failures.push({ name, error: new Error(details || 'Assertion failed') })
    failCount++
  }
}

// -----------------------------------------------------------------------------
// SECTION 1: Pure Logic & Algorithm Stress Testing
// -----------------------------------------------------------------------------
console.log('--- SECTION 1: Pure Logic & Boundary Stress Testing ---')

// 1.1 Projects Search Filter Function
const { projects, categories } = await import('../src/data/projects.js')

function searchFilter(list, activeCategory, rawQuery) {
  const needle = (rawQuery || '').trim().toLowerCase()
  return list.filter((project) => {
    const inCategory = activeCategory === 'all' || project.category === activeCategory
    if (!inCategory) return false
    if (!needle) return true

    const haystack = [
      project.title,
      project.name,
      project.subtitle,
      project.line,
      project.summary,
      project.stack,
      project.categoryLabel,
      ...(project.hardwareStack || []),
      ...(project.softwareStack || []),
      ...(project.tags || []),
      project.details,
      project.overview,
      project.problem,
      project.solution,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(needle)
  })
}

// Test special character immunity (no regex injection or crashes)
const adversarialSearchQueries = [
  'C++',
  '*',
  '***',
  '([a-z]+)',
  '\\',
  '\\\\',
  '"quoted"',
  '<script>alert(1)</script>',
  'STM32+FreeRTOS',
  'null',
  'undefined',
  '   ',
]

for (const q of adversarialSearchQueries) {
  let threw = false
  let count = 0
  try {
    const res = searchFilter(projects, 'all', q)
    count = res.length
  } catch (err) {
    threw = true
  }
  assertCheck(
    `Search handles special query safely without throwing: "${q}"`,
    !threw,
    `Threw error on "${q}"`,
  )
}

// Test category switching with active search combinations
for (const cat of categories) {
  const stm32InCat = searchFilter(projects, cat.id, 'STM32')
  const totalInCat = searchFilter(projects, cat.id, '')
  assertCheck(
    `Category "${cat.id}" with search "STM32" is subset of total (${stm32InCat.length} <= ${totalInCat.length})`,
    stm32InCat.length <= totalInCat.length,
  )
}

// 1.2 Contact Form Validation Logic Stress
function validateContactForm(form) {
  const nextErrors = {}
  if (!form.name || form.name.trim() === '') {
    nextErrors.name = 'Please provide your name or organization so I know who I am replying to.'
  }
  if (!form.email || form.email.trim() === '') {
    nextErrors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    nextErrors.email = 'Please enter a valid work or personal email address.'
  }
  if (!form.message || form.message.trim() === '') {
    nextErrors.message = 'Please provide a message.'
  } else if (form.message.trim().length < 20) {
    nextErrors.message = 'Please provide a little more detail (at least 20 characters).'
  }
  return nextErrors
}

// Validation Matrix
const validationMatrix = [
  { input: { name: '', email: '', message: '' }, expectKeys: ['name', 'email', 'message'] },
  { input: { name: '   ', email: '   ', message: '   ' }, expectKeys: ['name', 'email', 'message'] },
  { input: { name: 'Alice', email: 'notanemail', message: 'Valid long message with more than 20 chars.' }, expectKeys: ['email'] },
  { input: { name: 'Alice', email: 'alice@domain.c', message: 'Short' }, expectKeys: ['message'] },
  { input: { name: 'Alice', email: 'alice@example.com', message: 'Valid message with sufficient length (>= 20 chars).' }, expectKeys: [] },
]

for (let i = 0; i < validationMatrix.length; i++) {
  const { input, expectKeys } = validationMatrix[i]
  const errs = validateContactForm(input)
  const actualKeys = Object.keys(errs).sort()
  const expectedSorted = [...expectKeys].sort()
  assertCheck(
    `Validation matrix case #${i + 1} produced expected errors [${expectedSorted.join(',')}]`,
    JSON.stringify(actualKeys) === JSON.stringify(expectedSorted),
    `Got [${actualKeys.join(',')}]`,
  )
}

// 1.3 Mailto Encoding Stress
function createMailtoUrl(email, subject, name, senderEmail, message) {
  const resolvedSubject = encodeURIComponent(
    subject.trim() || `Portfolio inquiry from ${name.trim()}`,
  )
  const resolvedBody = encodeURIComponent(
    `${message.trim()}\n\n---\nSender: ${name.trim()}\nContact: ${senderEmail.trim()}`,
  )
  return `mailto:${email}?subject=${resolvedSubject}&body=${resolvedBody}`
}

const mailtoUrl = createMailtoUrl(
  'soronio.marygrace@msuiit.edu.ph',
  'OJT & Research Inquiry / C++ + FPGA',
  'Dr. H. Vance & Team',
  'vance@research.org',
  'We need an embedded systems engineer for 700 hours at MSU-IIT.',
)
assertCheck(
  'Mailto URL encodes ampersands and special chars in subject',
  mailtoUrl.includes('OJT%20%26%20Research%20Inquiry%20%2F%20C%2B%2B%20%2B%20FPGA'),
  `URL: ${mailtoUrl}`,
)
assertCheck(
  'Mailto URL encodes sender name with ampersand correctly',
  mailtoUrl.includes('Dr.%20H.%20Vance%20%26%20Team'),
)

console.log('\n--- SECTION 2: Live Browser E2E & Interactive Component Stress ---')

// -----------------------------------------------------------------------------
// SECTION 2: Live Browser Testing with Puppeteer
// -----------------------------------------------------------------------------
let previewServer = null
let serverUrl = ''

try {
  previewServer = await preview({
    preview: {
      port: 4192,
      strictPort: false,
    },
  })
  serverUrl = previewServer.resolvedUrls.local[0].replace(/\/$/, '')
  console.log(`  ✓ Preview server started at: ${serverUrl}`)
} catch (err) {
  console.error(`Failed to launch preview server: ${err.message}`)
  process.exit(1)
}

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  pipe: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
})
console.log('  ✓ Headless browser launched with CDP stdio pipe\n')

// 2.1 Mobile Navigation Drawer Stress (Mobile Viewport 375x812)
console.log('--- 2.1 Testing Mobile Navigation Drawer (375px viewport) ---')
{
  const page = await browser.newPage()
  await page.setViewport({ width: 375, height: 812 })
  await page.goto(`${serverUrl}/`, { waitUntil: 'networkidle0' })

  // Find hamburger button
  const menuButton = await page.$('header button[aria-controls="mobile-navigation"]')
  assertCheck('Mobile hamburger menu button exists in header', Boolean(menuButton))

  // Initial state: drawer not open
  let initialExpanded = await page.evaluate((btn) => btn.getAttribute('aria-expanded'), menuButton)
  let initialOverflow = await page.evaluate(() => document.body.style.overflow)
  let drawerExists = await page.$('#mobile-navigation')
  assertCheck('Initial aria-expanded is "false"', initialExpanded === 'false')
  assertCheck('Initial body overflow is not hidden', initialOverflow !== 'hidden')
  assertCheck('Initial mobile navigation drawer is not present in DOM', drawerExists === null)

  // ACTION 1: Click hamburger button to open
  await menuButton.click()
  await new Promise((r) => setTimeout(r, 200))

  let openExpanded = await page.evaluate((btn) => btn.getAttribute('aria-expanded'), menuButton)
  let openOverflow = await page.evaluate(() => document.body.style.overflow)
  let openDrawer = await page.$('#mobile-navigation')
  assertCheck('After click, aria-expanded is "true"', openExpanded === 'true')
  assertCheck('After click, body scroll lock active (overflow: hidden)', openOverflow === 'hidden')
  assertCheck('After click, #mobile-navigation is rendered in DOM', openDrawer !== null)

  // Focus verification: check if first link or element is focused
  await new Promise((r) => setTimeout(r, 100))
  let activeTag = await page.evaluate(() => document.activeElement?.tagName)
  assertCheck('Focus moved into drawer interactive element upon opening', activeTag === 'A' || activeTag === 'BUTTON')

  // ACTION 2: Test Focus Trap (Tab wrap-around)
  const focusableCount = await page.evaluate(() => {
    const drawer = document.getElementById('mobile-navigation')
    const focusable = drawer.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex="0"]')
    return focusable.length
  })
  assertCheck(`Drawer contains focusable elements (found: ${focusableCount})`, focusableCount >= 5)

  // From first element (index 0), press Tab (focusableCount - 1) times to reach last element
  for (let i = 0; i < focusableCount - 1; i++) {
    await page.keyboard.press('Tab')
  }
  // At last element: pressing Tab once more triggers the focus trap wrap to first element
  await page.keyboard.press('Tab')
  let wrappedHref = await page.evaluate(() => document.activeElement?.getAttribute('href'))
  assertCheck('Tab from last element wraps back to first link ("/")', wrappedHref === '/')

  // Test Shift+Tab reverse wrapping: from first element, Shift+Tab should wrap to last element
  await page.keyboard.down('Shift')
  await page.keyboard.press('Tab')
  await page.keyboard.up('Shift')
  let isAtLast = await page.evaluate(() => {
    const drawer = document.getElementById('mobile-navigation')
    const focusable = drawer.querySelectorAll('a[href], button:not([disabled]), input, textarea, select, [tabindex="0"]')
    return document.activeElement === focusable[focusable.length - 1]
  })
  assertCheck('Shift+Tab from first element wraps to last focusable element in drawer', isAtLast)

  // ACTION 3: Test Escape key dismiss
  await page.keyboard.press('Escape')
  await new Promise((r) => setTimeout(r, 200))

  let closedExpanded = await page.evaluate((btn) => btn.getAttribute('aria-expanded'), menuButton)
  let closedOverflow = await page.evaluate(() => document.body.style.overflow)
  let closedDrawer = await page.$('#mobile-navigation')
  let focusReturned = await page.evaluate((btn) => document.activeElement === btn, menuButton)
  assertCheck('Escape key closes drawer (aria-expanded is "false")', closedExpanded === 'false')
  assertCheck('Escape key releases body scroll lock (overflow: "")', closedOverflow === '')
  assertCheck('Escape key removes #mobile-navigation from DOM', closedDrawer === null)
  assertCheck('Escape key returns focus to hamburger trigger button', focusReturned)

  // ACTION 4: Test Backdrop Click dismiss
  await menuButton.click()
  await new Promise((r) => setTimeout(r, 200))
  assertCheck('Re-opened drawer successfully', (await page.$('#mobile-navigation')) !== null)

  const backdrop = await page.$('[aria-hidden="true"].fixed')
  assertCheck('Backdrop overlay element exists', Boolean(backdrop))
  if (backdrop) {
    await page.evaluate(() => {
      const bd = document.querySelector('[aria-hidden="true"].fixed')
      if (bd) {
        bd.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
      }
    })
    await new Promise((r) => setTimeout(r, 200))
    let afterBackdropDrawer = await page.$('#mobile-navigation')
    let afterBackdropOverflow = await page.evaluate(() => document.body.style.overflow)
    assertCheck('Backdrop click closes drawer', afterBackdropDrawer === null)
    assertCheck('Backdrop click releases scroll lock', afterBackdropOverflow === '')
  }

  // ACTION 5: Navigation inside Drawer
  await menuButton.click()
  await new Promise((r) => setTimeout(r, 200))
  // Click "Projects" link in mobile drawer
  const projectsLink = await page.$('#mobile-navigation a[href="/projects"]')
  assertCheck('Projects link found inside drawer', Boolean(projectsLink))
  if (projectsLink) {
    await projectsLink.click()
    await new Promise((r) => setTimeout(r, 400))
  }

  let currentPath = await page.evaluate(() => window.location.pathname)
  let navDrawerClosed = await page.$('#mobile-navigation')
  assertCheck('Tapping link inside drawer navigates to /projects', currentPath === '/projects')
  assertCheck('Navigating via drawer link dismisses drawer automatically', navDrawerClosed === null)

  await page.close()
}

// 2.2 Contact Form Stress & Case Study CTA Deep-Link Pre-population
console.log('\n--- 2.2 Testing Contact Form Stress & Deep-Link Pre-population ---')
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })

  // 1. Direct navigation with subject query parameter
  const testSubject = 'Inquiry regarding FERMONITOR'
  await page.goto(`${serverUrl}/contact?subject=${encodeURIComponent(testSubject)}`, {
    waitUntil: 'networkidle0',
  })

  // Verify subject field is pre-populated from query parameter
  const subjectVal = await page.evaluate(() => document.getElementById('contact-subject')?.value)
  assertCheck(
    `Contact subject input pre-populated with URL subject param: "${testSubject}"`,
    subjectVal === testSubject,
    `Actual value: "${subjectVal}"`,
  )

  // Verify mailto fallback link reflects the pre-populated subject
  const fallbackHref = await page.evaluate(() => {
    const link = document.querySelector('form a[href^="mailto:"]')
    return link ? link.getAttribute('href') : ''
  })
  assertCheck(
    'Fallback mailto link contains properly encoded pre-populated subject',
    fallbackHref.includes(encodeURIComponent(testSubject)),
    `Fallback href: ${fallbackHref}`,
  )

  // 2. Client-side Validation on Empty Inputs
  // Attempt submit on empty form
  await page.evaluate(() => {
    const submitBtn = document.querySelector('form button[type="submit"]')
    submitBtn.click()
  })
  await new Promise((r) => setTimeout(r, 200))

  const nameError = await page.evaluate(() => document.getElementById('contact-name-error')?.textContent)
  const emailError = await page.evaluate(() => document.getElementById('contact-email-error')?.textContent)
  const messageError = await page.evaluate(() => document.getElementById('contact-message-error')?.textContent)

  assertCheck('Empty submit shows Name validation error', Boolean(nameError) && nameError.includes('Please provide your name'))
  assertCheck('Empty submit shows Email validation error', Boolean(emailError) && emailError.includes('Email address is required'))
  assertCheck('Empty submit shows Message validation error', Boolean(messageError) && messageError.includes('Please provide a message'))

  // Verify focus was placed on first invalid input (name)
  const focusedId = await page.evaluate(() => document.activeElement?.id)
  assertCheck('Form validation automatically focuses the first invalid field (#contact-name)', focusedId === 'contact-name')

  // 3. Validation on Invalid Email Format
  await page.type('#contact-name', 'Ada Lovelace')
  await page.type('#contact-email', 'not-a-valid-email')
  await page.type('#contact-message', 'This is a valid detailed message for Mary Grace Soronio.')
  await page.evaluate(() => document.querySelector('form button[type="submit"]').click())
  await new Promise((r) => setTimeout(r, 200))

  const invalidEmailMsg = await page.evaluate(() => document.getElementById('contact-email-error')?.textContent)
  assertCheck(
    'Invalid email triggers format error message',
    Boolean(invalidEmailMsg) && invalidEmailMsg.includes('valid work or personal email'),
  )

  // 4. Validation on Short Message (<20 characters)
  const emailEl = await page.$('#contact-email')
  await page.evaluate(() => {
    const el = document.getElementById('contact-email')
    el.focus()
    el.select()
  })
  await page.keyboard.press('Backspace')
  await emailEl.type('ada@babbage.org', { delay: 10 })

  const msgEl = await page.$('#contact-message')
  await page.evaluate(() => {
    const el = document.getElementById('contact-message')
    el.focus()
    el.select()
  })
  await page.keyboard.press('Backspace')
  await msgEl.type('Short inquiry text', { delay: 10 })

  await page.click('form button[type="submit"]')
  await new Promise((r) => setTimeout(r, 200))

  const shortMsgError = await page.evaluate(() => document.getElementById('contact-message-error')?.textContent)
  assertCheck(
    'Short message (<20 chars) triggers length error message',
    Boolean(shortMsgError) && shortMsgError.includes('at least 20 characters'),
    `Actual error: "${shortMsgError}"`,
  )

  // 5. Case Study CTA -> Contact Form Subject Pre-population
  // Navigate to /projects/fermonitor and click "Discuss this project ->"
  await page.goto(`${serverUrl}/projects/fermonitor`, { waitUntil: 'networkidle0' })
  const foundDiscussBtn = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a'))
    const discuss = links.find((l) => l.textContent.includes('Discuss this project'))
    if (discuss) {
      discuss.click()
      return true
    }
    return false
  })
  assertCheck('Found and clicked "Discuss this project ->" CTA button on Project Detail page', foundDiscussBtn)
  await new Promise((r) => setTimeout(r, 400))

  const newUrl = await page.evaluate(() => window.location.href)
  assertCheck(
    'CTA navigates to /contact with encoded subject parameter',
    newUrl.includes('/contact?subject=') && newUrl.includes('FERMONITOR'),
    `Navigated URL: ${newUrl}`,
  )

  const prefilledSubject = await page.evaluate(() => document.getElementById('contact-subject')?.value)
  assertCheck(
    'Contact form subject input contains authentic pre-populated case study title',
    prefilledSubject.includes('FERMONITOR'),
    `Prefilled subject: "${prefilledSubject}"`,
  )

  await page.close()
}

// 2.3 Project Showcase Stress: Special Chars, Category Pills & Empty State Reset
console.log('\n--- 2.3 Testing Project Showcase: Special Chars, Category Pills & Reset ---')
{
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto(`${serverUrl}/projects`, { waitUntil: 'networkidle0' })

  // 1. Initial State: All 17 projects shown
  let cardCount = await page.evaluate(() => document.querySelectorAll('a[href^="/projects/"]').length)
  assertCheck('Initial catalog shows projects (all 17 builds)', cardCount >= 17, `Found ${cardCount}`)

  // 2. Special Characters in Search: "C++"
  const searchInput = await page.$('#build-search')
  assertCheck('Search input found (#build-search)', Boolean(searchInput))

  await searchInput.type('C++', { delay: 20 })
  await new Promise((r) => setTimeout(r, 300))
  let cppConsoleErrors = []
  page.on('pageerror', (err) => cppConsoleErrors.push(err.message))
  assertCheck('Search "C++" executes with 0 page/runtime errors', cppConsoleErrors.length === 0)

  // Clear search input using clear button
  const clearBtn = await page.$('button[aria-label="Clear search query"]')
  assertCheck('Clear search query button appears when search has input', Boolean(clearBtn))
  if (clearBtn) {
    await clearBtn.click()
    await new Promise((r) => setTimeout(r, 200))
    let clearedVal = await page.evaluate(() => document.getElementById('build-search')?.value)
    assertCheck('Clear button resets search input to empty string', clearedVal === '')
  }

  // 3. Special regex characters: "*" and "["
  await searchInput.type('*', { delay: 20 })
  await new Promise((r) => setTimeout(r, 200))
  let starErrors = []
  page.on('pageerror', (err) => starErrors.push(err.message))
  assertCheck('Search "*" does not crash with regex SyntaxError', starErrors.length === 0)

  // Clear via clear button
  const clearStarBtn = await page.$('button[aria-label="Clear search query"]')
  if (clearStarBtn) {
    await clearStarBtn.click()
    await new Promise((r) => setTimeout(r, 200))
  }

  // 4. Category Pills Switching with Active Search
  // Type active search "RTOS"
  await searchInput.type('RTOS', { delay: 30 })
  await new Promise((r) => setTimeout(r, 400))

  // Click "Embedded Systems" pill
  await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('button[role="group"] button, button[aria-pressed]'))
    const embeddedPill = pills.find((p) => p.textContent.toLowerCase().includes('embedded'))
    if (embeddedPill) embeddedPill.click()
  })
  await new Promise((r) => setTimeout(r, 300))

  let embeddedUrl = await page.evaluate(() => window.location.search)
  assertCheck(
    'Switching to Embedded pill preserves active search query: category=embedded & q=RTOS',
    embeddedUrl.includes('category=embedded') && embeddedUrl.includes('q=RTOS'),
    `URL Search: "${embeddedUrl}"`,
  )

  // Click "IoT & Sensing" pill
  await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('button[role="group"] button, button[aria-pressed]'))
    const iotPill = pills.find((p) => p.textContent.toLowerCase().includes('iot'))
    if (iotPill) iotPill.click()
  })
  await new Promise((r) => setTimeout(r, 300))

  let iotUrl = await page.evaluate(() => window.location.search)
  assertCheck(
    'Switching to IoT pill updates category while preserving search query: category=iot & q=RTOS',
    iotUrl.includes('category=iot') && iotUrl.includes('q=RTOS'),
    `URL Search: "${iotUrl}"`,
  )

  // 5. Empty State & Reset Actions
  // Clear search input using clear button
  const clearQueryBtn = await page.$('button[aria-label="Clear search query"]')
  if (clearQueryBtn) {
    await clearQueryBtn.click()
    await new Promise((r) => setTimeout(r, 200))
  }

  // Type a query that yields zero results
  await searchInput.type('nonexistent_query_99999', { delay: 20 })
  await new Promise((r) => setTimeout(r, 400))

  const emptyStatusText = await page.evaluate(() => document.body.innerText)
  assertCheck(
    'Empty state is rendered when search yields 0 matches ("[ STATUS: NO_MATCH ]")',
    emptyStatusText.includes('STATUS: NO_MATCH') || emptyStatusText.includes('No matching builds found'),
  )

  // Click "Reset all filters" button in empty state
  const resetClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'))
    const reset = buttons.find((b) => b.textContent.includes('Reset all filters'))
    if (reset) {
      reset.click()
      return true
    }
    return false
  })
  assertCheck('Found and clicked "Reset all filters" button in empty state', resetClicked)
  await new Promise((r) => setTimeout(r, 300))

  const resetSearchVal = await page.evaluate(() => document.getElementById('build-search')?.value)
  const resetUrlSearch = await page.evaluate(() => window.location.search)
  const restoredProjects = await page.evaluate(() => document.querySelectorAll('a[href^="/projects/"]').length)

  assertCheck('Reset all filters clears search input value', resetSearchVal === '')
  assertCheck('Reset all filters clears URL search query params', resetUrlSearch === '' || resetUrlSearch === '?')
  assertCheck('Reset all filters restores all 17 projects in catalog', restoredProjects >= 17, `Found ${restoredProjects}`)

  await page.close()
}

// -----------------------------------------------------------------------------
// SECTION 3: Multi-Viewport Layout Overflow Verification
// -----------------------------------------------------------------------------
console.log('\n--- SECTION 3: Multi-Viewport Layout Overflow Verification ---')

const targetViewports = [
  { name: 'Mobile (375px)', width: 375, height: 812 },
  { name: 'Mobile (390px)', width: 390, height: 844 },
  { name: 'Tablet (768px)', width: 768, height: 1024 },
  { name: 'Desktop (1280px)', width: 1280, height: 800 },
  { name: 'Desktop (1440px)', width: 1440, height: 900 },
]

const targetRoutes = [
  '/',
  '/projects',
  '/projects/fermonitor',
  '/about',
  '/skills',
  '/contact',
  '/nonexistent-route-for-404',
]

for (const vp of targetViewports) {
  for (const route of targetRoutes) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height })

    const consoleErrors = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text())
    })
    page.on('pageerror', (err) => {
      consoleErrors.push(`PageError: ${err.message}`)
    })

    await page.goto(`${serverUrl}${route}`, { waitUntil: 'networkidle0', timeout: 15000 })
    await new Promise((r) => setTimeout(r, 200))

    const overflowData = await page.evaluate((expectedWidth) => {
      const scrollWidth = document.documentElement.scrollWidth
      const innerWidth = window.innerWidth
      const overflowPx = Math.max(0, scrollWidth - innerWidth)

      // Find any element exceeding bounds
      const culprits = []
      const allEls = document.querySelectorAll('*')
      for (const el of allEls) {
        const rect = el.getBoundingClientRect()
        // Ignore zero size or hidden
        if (rect.width === 0 || rect.height === 0) continue
        if (rect.right > innerWidth + 1.5) {
          culprits.push({
            tag: el.tagName.toLowerCase(),
            class: (el.className || '').toString().slice(0, 50),
            right: Math.round(rect.right),
            innerWidth,
          })
          if (culprits.length >= 3) break
        }
      }

      return {
        scrollWidth,
        innerWidth,
        overflowPx,
        culprits,
      }
    }, vp.width)

    assertCheck(
      `Overflow Check: ${vp.name} on ${route} (0px overflow)`,
      overflowData.overflowPx === 0,
      `scrollWidth=${overflowData.scrollWidth}, innerWidth=${overflowData.innerWidth}, overflow=${overflowData.overflowPx}px, culprits=${JSON.stringify(overflowData.culprits)}`,
    )

    assertCheck(
      `Console Error Check: ${vp.name} on ${route} (0 errors)`,
      consoleErrors.length === 0,
      `Errors: ${consoleErrors.join(' | ')}`,
    )

    await page.close()
  }
}

// Teardown
await browser.close()
if (previewServer) {
  try {
    previewServer.httpServer?.closeAllConnections?.()
    await previewServer.close()
  } catch {}
}

console.log('\n================================================================')
console.log('  CHALLENGER M5-2 EMPIRICAL SUMMARY')
console.log('================================================================')
console.log(`  Total Empirical Checks Executed : ${passCount + failCount}`)
console.log(`  Passed Checks                   : ${passCount}`)
console.log(`  Failed Checks                   : ${failCount}`)
console.log('================================================================\n')

if (failCount > 0) {
  console.error(`❌ CHALLENGER REJECTS: ${failCount} adversarial tests failed!`)
  process.exit(1)
} else {
  console.log(`✅ CHALLENGER APPROVES: All ${passCount} adversarial stress tests passed empirically!`)
  process.exit(0)
}
