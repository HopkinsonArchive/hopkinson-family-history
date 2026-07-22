const script = String.raw`
function readQuartzTheme() {
  const root = document.documentElement
  const attr =
    root.getAttribute("saved-theme") ||
    root.getAttribute("data-theme") ||
    root.dataset.archiveTheme

  if (attr === "light" || attr === "dark") return attr

  const stored =
    localStorage.getItem("saved-theme") ||
    localStorage.getItem("theme")

  if (stored === "light" || stored === "dark") return stored
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function setArchiveTheme(theme) {
  if (theme !== "light" && theme !== "dark") return
  document.documentElement.dataset.archiveTheme = theme
}

function refreshArchiveTheme() {
  requestAnimationFrame(() => setArchiveTheme(readQuartzTheme()))
}

document.addEventListener("nav", refreshArchiveTheme)
document.addEventListener("render", refreshArchiveTheme)
document.addEventListener("themechange", (event) => {
  const theme = event && event.detail && event.detail.theme
  setArchiveTheme(theme === "dark" ? "dark" : "light")
})

const archiveThemeObserver = new MutationObserver(refreshArchiveTheme)
archiveThemeObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["saved-theme", "data-theme", "class"],
})

refreshArchiveTheme()
`

export default script
