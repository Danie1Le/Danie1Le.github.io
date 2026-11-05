export const THEME_STORAGE_KEY = "theme";

const REVEALED_FLAG = "__revealed";
const REVEAL_FALLBACK_MS = 4000;

export const bootScript = `
(function boot() {
function restoreSavedTheme() {
  try {
    var savedTheme = localStorage.getItem("${THEME_STORAGE_KEY}");
    if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  } catch (storageBlocked) {}
}
function armScrollReveals() {
  document.documentElement.classList.add("js");
  setTimeout(function disarmRevealsIfAppNeverHydrated() {
    if (!window.${REVEALED_FLAG}) document.documentElement.classList.remove("js");
  }, ${REVEAL_FALLBACK_MS});
}
restoreSavedTheme();
armScrollReveals();
})();
`;

export function markRevealsHydrated() {
  (window as Window & { [REVEALED_FLAG]?: boolean })[REVEALED_FLAG] = true;
}
