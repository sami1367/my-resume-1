// Embed the bundled, OFL-licensed font so web and PDF output work offline.
const fs = require('node:fs');
const path = require('node:path');
const faces = [['Regular', 400], ['SemiBold', 600], ['Bold', 700]].map(([name, weight]) => {
  const data = fs.readFileSync(path.join(__dirname, `modern-classic-fa/fonts/Vazirmatn-${name}.ttf`)).toString('base64');
  return `@font-face{font-family:Vazirmatn;src:url(data:font/ttf;base64,${data}) format('truetype');font-weight:${weight};font-style:normal;font-display:block}`;
}).join('');
exports.faces = faces;
exports.apply = html => html
  .replace(/<link\b[^>]*href=["']https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>/gi, '')
  .replace('</head>', `<style>${faces}
    :root{--resume-font-sans:Vazirmatn,sans-serif}
    body,body *{font-family:Vazirmatn,sans-serif!important}
  </style></head>`);
