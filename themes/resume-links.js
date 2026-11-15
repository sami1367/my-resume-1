const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Absolute URLs remain usable when a PDF is downloaded or shared.
exports.addLinks = (html, resume) => {
  const meta = resume.meta || {};
  const persian = meta.alternateLanguage === 'en';
  const links = [
    [meta.githubUrl, meta.githubUrl],
    [meta.alternatePdfUrl, persian ? 'English PDF' : 'نسخه فارسی PDF'],
  ].filter(([url]) => /^https?:\/\//i.test(url || ''));
  if (!links.length) return html;
  const nav = `<nav class="resume-links" aria-label="${persian ? 'نسخه‌های رزومه' : 'Resume links'}" dir="${persian ? 'rtl' : 'ltr'}">${links.map(([url, label]) => `<a href="${escape(url)}"><bdi dir="auto">${escape(label)}</bdi></a>`).join('')}</nav>`;
  return html.replace('</head>', `<style>.resume-links{display:flex;flex-wrap:wrap;gap:4px 18px;margin:8px 0 0;font-size:9pt;line-height:1.8;break-inside:avoid}.resume-links a{color:#0066cc;text-decoration:none;overflow-wrap:anywhere}</style></head>`)
    .replace(/<header\b[^>]*>[\s\S]*?<\/header>/i, header => {
      // Local Persian, Modern Classic English, and Even website contacts.
      const contacts = /<div\b[^>]*class="[^"]*\b(?:contacts|resume-contact)\b[^"]*"[^>]*>[\s\S]*?<\/div>|<ul\b[^>]*class="icon-list"[^>]*>[\s\S]*?<\/ul>/i;
      return header.replace(contacts, match => match + nav);
    });
};
