// tests/helpers/contracts.js
// Authoritative contract schemas and verification helpers based on PROJECT.md & ORIGINAL_REQUEST.md

export const EXPECTED_PROJECT_SLUGS = [
  'fermonitor',
  'etee',
  'aquaflush',
  'room-monitoring',
  'drying-oven',
  'rtthread-hmi',
  'fpga-oven',
  'dc-supply',
  'line-robot',
  'mp3-player',
  'keyboard-detection',
  'activity-recognition',
  'ricedirect',
  'digistamp',
  'contribution-tracker',
  'campuslink',
  'qr-attendance',
];

export const VALID_CATEGORIES = [
  'all',
  'embedded',
  'iot',
  'digital-logic',
  'software',
];

export const EXPECTED_PROFILE = {
  name: 'Mary Grace V. Soronio',
  university: 'Mindanao State University - Iligan Institute of Technology',
  universityShort: 'MSU-IIT',
  degree: 'Bachelor of Science in Computer Engineering',
  specialization: 'Embedded Systems',
  cgpa: '1.67351',
  deanLister: true,
  ojtTargetHours: 700,
  email: 'marygrace.soronio@g.msuiit.edu.ph',
  phone: '+63 966 043 4042',
  githubUser: 'MaryGraceSoronio',
  githubUrl: 'https://github.com/MaryGraceSoronio',
  linkedinUrl: 'https://www.linkedin.com/in/mary-grace-soronio-943663298',
};

export const EXPECTED_CORE_ROUTES = [
  '/',
  '/projects',
  '/projects/:slug',
  '/about',
  '/skills',
  '/contact',
  '*',
];

export function validateProjectSchema(project) {
  const errors = [];
  if (!project || typeof project !== 'object') {
    return { valid: false, errors: ['Project must be an object'] };
  }
  if (!project.slug || typeof project.slug !== 'string' || !/^[a-z0-9-]+$/.test(project.slug)) {
    errors.push(`Invalid slug: ${project.slug}`);
  }
  const title = project.title || project.name;
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push(`Missing or empty title for ${project.slug}`);
  }
  if (!project.category || !VALID_CATEGORIES.includes(project.category)) {
    errors.push(`Invalid category: ${project.category} in ${project.slug}`);
  }
  const summary = project.summary || project.line;
  if (!summary || typeof summary !== 'string' || summary.trim().length === 0) {
    errors.push(`Missing summary/line in ${project.slug}`);
  }
  const details = project.details || project.overview;
  if (!details || typeof details !== 'string' || details.trim().length === 0) {
    errors.push(`Missing details/overview in ${project.slug}`);
  }
  if (project.image !== null && typeof project.image !== 'string') {
    errors.push(`Image must be string or null in ${project.slug}`);
  }
  if (!Array.isArray(project.links)) {
    errors.push(`Links must be an array in ${project.slug}`);
  }
  return { valid: errors.length === 0, errors };
}

export function validateThemeContext(ctx) {
  const errors = [];
  if (!ctx || typeof ctx !== 'object') {
    return { valid: false, errors: ['Context must be an object'] };
  }
  if (ctx.theme !== 'dark' && ctx.theme !== 'light') {
    errors.push(`Invalid theme value: ${ctx.theme}`);
  }
  if (typeof ctx.toggleTheme !== 'function') {
    errors.push('toggleTheme must be a function');
  }
  if (typeof ctx.setTheme !== 'function') {
    errors.push('setTheme must be a function');
  }
  return { valid: errors.length === 0, errors };
}
