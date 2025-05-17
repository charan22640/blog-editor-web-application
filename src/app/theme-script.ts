// This script runs inline before page load to prevent flash
export const themeScript = `
  let isDark;
  try {
    isDark = localStorage.theme === 'light' ? false : true;
  } catch (e) {
    isDark = true;
  }
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
`;
