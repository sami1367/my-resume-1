const { apply } = require('../fonts');
exports.render = async resume => {
  const theme = await import('jsonresume-theme-modern-classic');
  return apply(await theme.render(resume));
};
