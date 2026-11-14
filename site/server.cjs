'use strict';
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { apply: applyFonts } = require('../themes/fonts');
const themes = {
  fa: require('../themes/modern-classic-fa'),
};
const root = path.resolve(__dirname, '..');

async function render(language, prefix = '../') {
  const resume = JSON.parse(await fs.readFile(path.join(root, `resumes/resume.${language}.json`), 'utf8'));
  const theme = language === 'en' ? await import('jsonresume-theme-even') : themes.fa;
  const rendered = await theme.render(resume);
  const html = language === 'en' ? applyFonts(rendered) : rendered;
  const nav = `<nav class="language-switch" aria-label="${language === 'fa' ? 'انتخاب زبان' : 'Language'}" dir="ltr">
    <a href="${prefix}en/" lang="en" hreflang="en" ${language === 'en' ? 'aria-current="page"' : ''}>English</a>
    <a href="${prefix}fa/" lang="fa" hreflang="fa" ${language === 'fa' ? 'aria-current="page"' : ''}>فارسی</a>
  </nav>`;
  const css = `<style>
    .language-switch { grid-column: 1 / -1; grid-row: 1; display: flex; justify-content: center; gap: 8px; padding: 16px; margin: 0 auto 20px; direction: ltr; font: 16px/1.5 Vazirmatn, sans-serif; }
    .language-switch a { display: inline-block; padding: 6px 18px; border: 1px solid #d1d5db; border-radius: 6px; color: #334155; background: white; text-decoration: none; }
    .language-switch a[aria-current] { background: #334155; color: white; border-color: #334155; }
    .language-switch a:focus-visible { outline: 3px solid #2563eb; outline-offset: 3px; }
    @media print { .language-switch { display: none; } }
  </style>`;
  return html.replace('</head>', `${css}</head>`).replace(/<body\b[^>]*>/i, match => match + nav);
}

async function build() {
  for (const language of ['en', 'fa']) {
    const directory = path.join(root, 'dist', language);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(path.join(directory, 'index.html'), await render(language));
  }
  await fs.writeFile(path.join(root, 'dist/index.html'), await render('en', './'));
  console.log('Built both languages in dist/');
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (pathname === '/') {
    res.writeHead(302, { Location: '/en/' });
    return res.end();
  }
  const match = /^\/(en|fa)\/$/.exec(pathname);
  if (!match || !['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(404);
    return res.end('Not found');
  }
  try {
    const html = await render(match[1]);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : html);
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end('Unable to render resume. Check the terminal for details.');
  }
});

if (require.main === module) {
  if (process.argv.includes('--build')) build().catch(error => { console.error(error); process.exitCode = 1; });
  else {
    const port = Number(process.env.PORT || 4000);
    server.listen(port, '127.0.0.1', () => console.log(`Resume website: http://localhost:${port}`));
  }
}
module.exports = { server, render, build };
