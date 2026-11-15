const { addLinks } = require('../resume-links');
const { apply } = require('../fonts');
exports.render = async resume => {
  const theme = await import('jsonresume-theme-modern-classic');
  return addLinks(apply(await theme.render(resume)), resume);
};
