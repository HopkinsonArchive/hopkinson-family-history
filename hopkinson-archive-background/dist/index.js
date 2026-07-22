import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
const styles = String.raw `
:root,
html[saved-theme="light"],
html[data-theme="light"],
html[data-archive-theme="light"] {
  --archive-canvas: #f4eddd;
  --archive-paper: #f7f1e5;
  --archive-ink: #40545e;
  --archive-faint: #756b5d;
  --archive-grid: #8f7961;
  --archive-gold: #b28a43;
  --archive-rust: #965e4c;
  --archive-vignette: #7e6a51;
  --archive-center-opacity: 0.78;
}

html[saved-theme="dark"],
html[data-theme="dark"],
html[data-archive-theme="dark"] {
  --archive-canvas: #14191c;
  --archive-paper: #171d20;
  --archive-ink: #9eb1b8;
  --archive-faint: #7c756b;
  --archive-grid: #6f675d;
  --archive-gold: #c7a66b;
  --archive-rust: #b67a66;
  --archive-vignette: #050708;
  --archive-center-opacity: 0.82;
}

/*
 * The component is emitted in beforeBody, which places it inside the page's
 * stacking context. Keep it behind every interactive Quartz component.
 */
.page {
  position: relative;
  isolation: isolate;
}

.archive-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none !important;
  user-select: none;
  opacity: calc(0.76 * var(--archive-intensity, 1));
}

.archive-background,
.archive-background * {
  pointer-events: none !important;
}

.archive-background__svg {
  display: block;
  width: 100%;
  height: 100%;
}

.archive-paper { fill: var(--archive-paper); }
.archive-paper-noise { fill: #fff; opacity: 0.22; }
.archive-layer { fill: none; vector-effect: non-scaling-stroke; }
.archive-layer--registration { stroke: var(--archive-grid); stroke-width: 1; opacity: 0.25; }
.archive-layer--topography { stroke: var(--archive-ink); stroke-width: 1.05; opacity: 0.18; }
.archive-layer--lineage { stroke: var(--archive-ink); stroke-width: 1.65; opacity: 0.56; }
.archive-node { fill: var(--archive-paper); stroke: var(--archive-ink); stroke-width: 1.5; transform-box: fill-box; transform-origin: center; }
.archive-node--major { fill: var(--archive-ink); stroke: var(--archive-paper); stroke-width: 2.2; }
.archive-node--minor { fill: var(--archive-paper); }
.archive-node--open { fill: transparent; }
.archive-node--gold { fill: var(--archive-gold); stroke: var(--archive-gold); }
.archive-node--diamond { fill: var(--archive-paper); stroke: var(--archive-gold); }
.archive-traveler { fill: var(--archive-gold); stroke: var(--archive-paper); stroke-width: 2; }
.archive-layer--documents { stroke: var(--archive-grid); stroke-width: 1; opacity: 0.14; }
.archive-ledger { opacity: 0.62; }
.archive-manuscript { stroke-width: 1.15; stroke-dasharray: 3 8; }
.archive-cemetery { opacity: 0.58; }
.archive-layer--routes { stroke: var(--archive-faint); stroke-width: 1.35; opacity: 0.38; }
.archive-route--inference { stroke-dasharray: 11 8; }
.archive-route--unverified { stroke-dasharray: 2 8; }
.archive-route--unresolved { stroke: var(--archive-rust); stroke-dasharray: 5 9; }
.archive-layer--routes circle,
.archive-layer--routes rect { fill: var(--archive-paper); stroke: currentColor; }
.archive-center-veil { opacity: var(--archive-center-opacity); }
.archive-vignette { pointer-events: none; }

.archive-background--motion .archive-trace {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: archive-line-draw var(--archive-duration, 30s) ease-out var(--archive-delay, 0s) forwards;
}

.archive-background--motion .archive-node {
  animation: archive-node-breathe 13s ease-in-out infinite;
}

.archive-background--motion .archive-node:nth-of-type(3n) { animation-delay: -4s; }
.archive-background--motion .archive-node:nth-of-type(4n) { animation-delay: -8s; }

@keyframes archive-line-draw {
  to { stroke-dashoffset: 0; }
}

@keyframes archive-node-breathe {
  0%, 100% { opacity: 0.34; transform: scale(0.97); }
  50% { opacity: 0.72; transform: scale(1.04); }
}

.archive-background--person .archive-layer--documents { opacity: 0.09; }
.archive-background--person .archive-layer--routes { opacity: 0.25; }
.archive-background--lineage .archive-layer--lineage { opacity: 0.72; }
.archive-background--lineage .archive-center-veil { opacity: 0.72; }
.archive-background--research .archive-route--unverified,
.archive-background--research .archive-route--unresolved { opacity: 0.78; }
.archive-background--standards .archive-layer--documents { opacity: 0.23; }
.archive-background--home .archive-center-veil { opacity: 0.72; }

@media (max-width: 1100px) {
  .archive-layer--documents { opacity: 0.08; }
  .archive-center-veil { opacity: 0.9; }
}

@media (max-width: 760px) {
  .archive-background { opacity: calc(0.48 * var(--archive-intensity, 1)); }
  .archive-layer--documents,
  .archive-layer--registration,
  .archive-traveler { display: none; }
  .archive-layer--lineage { transform: translateX(-110px) scale(1.08); transform-origin: left center; opacity: 0.34; }
  .archive-layer--routes { opacity: 0.18; }
  .archive-center-veil { opacity: 0.96; }
}

@media (prefers-reduced-motion: reduce) {
  .archive-background *,
  .archive-background *::before,
  .archive-background *::after {
    animation: none !important;
  }
  .archive-traveler { display: none; }
  .archive-trace { stroke-dasharray: none; stroke-dashoffset: 0; }
}
`;
const script = String.raw `
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
`;
const defaults = {
    enabled: true,
    motion: true,
    intensity: 1,
    defaultVariant: "default",
};
let initializedOptions = { ...defaults };
export function init(options) {
    initializedOptions = { ...defaults, ...(options ?? {}) };
}
function variantForPage(props) {
    const frontmatter = props.fileData.frontmatter ?? {};
    const requested = String(frontmatter.archive_background ?? "").toLowerCase();
    const allowed = new Set(["home", "person", "lineage", "research", "standards", "default"]);
    if (allowed.has(requested))
        return requested;
    const pageType = String(frontmatter.page_type ?? "").toLowerCase();
    const slug = String(props.fileData.slug ?? "").toLowerCase();
    if (pageType === "person")
        return "person";
    if (slug === "index" || slug === "")
        return "home";
    if (slug.includes("lineage"))
        return "lineage";
    if (slug.includes("research"))
        return "research";
    if (slug.includes("standard") || slug.includes("about"))
        return "standards";
    return initializedOptions.defaultVariant;
}
const ArchiveBackground = (props) => {
    if (!initializedOptions.enabled)
        return null;
    const variant = variantForPage(props);
    const intensity = Math.max(0.35, Math.min(1.4, initializedOptions.intensity));
    const motionClass = initializedOptions.motion ? "archive-background--motion" : "archive-background--still";
    return (_jsx("div", { class: `archive-background archive-background--${variant} ${motionClass}`, style: { "--archive-intensity": String(intensity) }, "aria-hidden": "true", children: _jsxs("svg", { class: "archive-background__svg", viewBox: "0 0 1920 1080", preserveAspectRatio: "xMidYMid slice", children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "archiveCenterVeil", x1: "0", y1: "0", x2: "1", y2: "0", children: [_jsx("stop", { offset: "0", stopColor: "var(--archive-canvas)", stopOpacity: "0" }), _jsx("stop", { offset: "0.22", stopColor: "var(--archive-canvas)", stopOpacity: "0.58" }), _jsx("stop", { offset: "0.5", stopColor: "var(--archive-canvas)", stopOpacity: "0.9" }), _jsx("stop", { offset: "0.78", stopColor: "var(--archive-canvas)", stopOpacity: "0.58" }), _jsx("stop", { offset: "1", stopColor: "var(--archive-canvas)", stopOpacity: "0" })] }), _jsxs("radialGradient", { id: "archiveVignette", cx: "50%", cy: "44%", r: "75%", children: [_jsx("stop", { offset: "0", stopColor: "var(--archive-canvas)", stopOpacity: "0" }), _jsx("stop", { offset: "0.72", stopColor: "var(--archive-vignette)", stopOpacity: "0.08" }), _jsx("stop", { offset: "1", stopColor: "var(--archive-vignette)", stopOpacity: "0.23" })] }), _jsxs("filter", { id: "archivePaperNoise", x: "-10%", y: "-10%", width: "120%", height: "120%", children: [_jsx("feTurbulence", { type: "fractalNoise", baseFrequency: "0.72", numOctaves: "2", seed: "17", result: "noise" }), _jsx("feColorMatrix", { in: "noise", type: "saturate", values: "0", result: "grayNoise" }), _jsx("feComponentTransfer", { in: "grayNoise", children: _jsx("feFuncA", { type: "table", tableValues: "0 0.055" }) })] })] }), _jsx("rect", { class: "archive-paper", x: "0", y: "0", width: "1920", height: "1080" }), _jsx("rect", { class: "archive-paper-noise", x: "0", y: "0", width: "1920", height: "1080", filter: "url(#archivePaperNoise)" }), _jsxs("g", { class: "archive-layer archive-layer--registration", children: [_jsx("path", { d: "M40 92 V40 H92 M1828 40 H1880 V92 M40 988 V1040 H92 M1828 1040 H1880 V988" }), _jsx("path", { d: "M160 40 V80 M140 60 H180 M1760 40 V80 M1740 60 H1780" }), _jsx("circle", { cx: "365", cy: "86", r: "21" }), _jsx("circle", { cx: "365", cy: "86", r: "7" }), _jsx("path", { d: "M365 48V124 M327 86H403" })] }), _jsxs("g", { class: "archive-layer archive-layer--topography archive-layer--topography-top", children: [_jsx("path", { d: "M 0.0 90.0 L 80.0 104.4 L 160.0 110.2 L 240.0 106.2 L 320.0 98.4 L 400.0 92.1 L 480.0 87.4 L 560.0 80.9 L 640.0 73.1 L 720.0 69.9 L 800.0 76.6 L 880.0 91.5 L 960.0 105.4 L 1040.0 110.2 L 1120.0 105.6 L 1200.0 97.7 L 1280.0 91.7 L 1360.0 86.9 L 1440.0 80.2 L 1520.0 72.6 L 1600.0 70.0 L 1680.0 77.8 L 1760.0 92.9 L 1840.0 106.3 L 1920.0 110.1" }), _jsx("path", { d: "M 0.0 112.8 L 80.0 126.4 L 160.0 128.4 L 240.0 119.9 L 320.0 108.8 L 400.0 101.3 L 480.0 96.7 L 560.0 91.3 L 640.0 85.8 L 720.0 86.3 L 800.0 97.3 L 880.0 114.4 L 960.0 127.1 L 1040.0 128.0 L 1120.0 118.8 L 1200.0 107.9 L 1280.0 100.8 L 1360.0 96.3 L 1440.0 90.7 L 1520.0 85.5 L 1600.0 86.9 L 1680.0 98.7 L 1760.0 115.9 L 1840.0 127.7 L 1920.0 127.4" }), _jsx("path", { d: "M 0.0 136.3 L 80.0 147.2 L 160.0 144.0 L 240.0 130.6 L 320.0 117.0 L 400.0 109.6 L 480.0 106.4 L 560.0 103.2 L 640.0 100.9 L 720.0 105.5 L 800.0 119.9 L 880.0 137.7 L 960.0 147.5 L 1040.0 143.1 L 1120.0 129.2 L 1200.0 116.1 L 1280.0 109.2 L 1360.0 106.2 L 1440.0 102.9 L 1520.0 101.0 L 1600.0 106.4 L 1680.0 121.5 L 1760.0 139.1 L 1840.0 147.7 L 1920.0 142.1" }), _jsx("path", { d: "M 0.0 159.2 L 80.0 165.6 L 160.0 156.4 L 240.0 138.5 L 320.0 123.8 L 400.0 118.0 L 480.0 117.7 L 560.0 117.6 L 640.0 118.9 L 720.0 127.1 L 800.0 143.7 L 880.0 160.4 L 960.0 165.4 L 1040.0 155.0 L 1120.0 136.9 L 1200.0 122.9 L 1280.0 117.8 L 1360.0 117.7 L 1440.0 117.6 L 1520.0 119.2 L 1600.0 128.3 L 1680.0 145.4 L 1760.0 161.5 L 1840.0 165.1 L 1920.0 153.5" }), _jsx("path", { d: "M 0.0 180.3 L 80.0 180.9 L 160.0 165.5 L 240.0 144.2 L 320.0 130.1 L 400.0 127.7 L 480.0 131.3 L 560.0 134.9 L 640.0 139.5 L 720.0 150.4 L 800.0 167.5 L 880.0 181.1 L 960.0 180.1 L 1040.0 163.5 L 1120.0 142.4 L 1200.0 129.4 L 1280.0 127.9 L 1360.0 131.7 L 1440.0 135.2 L 1520.0 140.2 L 1600.0 151.8 L 1680.0 169.1 L 1760.0 181.7 L 1840.0 179.1 L 1920.0 161.6" }), _jsx("path", { d: "M 0.0 198.6 L 80.0 192.4 L 160.0 171.4 L 240.0 148.5 L 320.0 137.2 L 400.0 139.8 L 480.0 148.2 L 560.0 155.2 L 640.0 162.2 L 720.0 174.4 L 800.0 190.0 L 880.0 198.8 L 960.0 191.0 L 1040.0 169.1 L 1120.0 146.8 L 1200.0 137.0 L 1280.0 140.5 L 1360.0 148.9 L 1440.0 155.8 L 1520.0 163.1 L 1600.0 175.7 L 1680.0 191.3 L 1760.0 198.8 L 1840.0 189.4 L 1920.0 166.9" }), _jsx("path", { d: "M 0.0 213.2 L 80.0 200.3 L 160.0 174.9 L 240.0 152.8 L 320.0 146.5 L 400.0 155.3 L 480.0 168.4 L 560.0 178.0 L 640.0 186.1 L 720.0 197.6 L 800.0 210.0 L 880.0 212.8 L 960.0 198.3 L 1040.0 172.5 L 1120.0 151.4 L 1200.0 146.8 L 1280.0 156.5 L 1360.0 169.5 L 1440.0 178.8 L 1520.0 187.0 L 1600.0 198.8 L 1680.0 210.9 L 1760.0 212.2 L 1840.0 196.2 L 1920.0 170.2" }), _jsx("path", { d: "M 0.0 223.8 L 80.0 204.9 L 160.0 177.4 L 240.0 158.5 L 320.0 159.1 L 400.0 174.7 L 480.0 191.8 L 560.0 202.5 L 640.0 209.8 L 720.0 218.8 L 800.0 226.6 L 880.0 222.8 L 960.0 202.5 L 1040.0 175.1 L 1120.0 157.7 L 1200.0 160.1 L 1280.0 176.4 L 1360.0 193.1 L 1440.0 203.2 L 1520.0 210.5 L 1600.0 219.7 L 1680.0 226.9 L 1760.0 221.6 L 1840.0 200.1 L 1920.0 172.8" })] }), _jsxs("g", { class: "archive-layer archive-layer--topography archive-layer--topography-bottom", children: [_jsx("path", { d: "M 0.0 930.0 L 80.0 944.3 L 160.0 953.1 L 240.0 954.2 L 320.0 949.0 L 400.0 941.5 L 480.0 935.0 L 560.0 930.3 L 640.0 925.6 L 720.0 919.4 L 800.0 911.8 L 880.0 906.2 L 960.0 906.3 L 1040.0 914.3 L 1120.0 928.2 L 1200.0 942.8 L 1280.0 952.5 L 1360.0 954.4 L 1440.0 949.8 L 1520.0 942.4 L 1600.0 935.7 L 1680.0 930.8 L 1760.0 926.2 L 1840.0 920.2 L 1920.0 912.7" }), _jsx("path", { d: "M 0.0 955.0 L 80.0 967.8 L 160.0 972.7 L 240.0 968.8 L 320.0 959.1 L 400.0 948.6 L 480.0 940.8 L 560.0 936.0 L 640.0 932.2 L 720.0 927.6 L 800.0 922.8 L 880.0 921.1 L 960.0 925.7 L 1040.0 937.5 L 1120.0 953.1 L 1200.0 966.6 L 1280.0 972.6 L 1360.0 969.7 L 1440.0 960.4 L 1520.0 949.8 L 1600.0 941.5 L 1680.0 936.5 L 1760.0 932.7 L 1840.0 928.2 L 1920.0 923.3" }), _jsx("path", { d: "M 0.0 979.5 L 80.0 988.7 L 160.0 988.3 L 240.0 978.9 L 320.0 965.2 L 400.0 953.0 L 480.0 945.5 L 560.0 942.3 L 640.0 940.9 L 720.0 939.1 L 800.0 937.8 L 880.0 940.0 L 960.0 948.5 L 1040.0 962.6 L 1120.0 977.9 L 1200.0 988.1 L 1280.0 988.9 L 1360.0 980.4 L 1440.0 966.9 L 1520.0 954.2 L 1600.0 946.1 L 1680.0 942.6 L 1760.0 941.0 L 1840.0 939.3 L 1920.0 937.8" }), _jsx("path", { d: "M 0.0 1001.6 L 80.0 1005.7 L 160.0 999.1 L 240.0 984.6 L 320.0 968.2 L 400.0 956.1 L 480.0 950.9 L 560.0 951.0 L 640.0 953.0 L 720.0 954.7 L 800.0 956.9 L 880.0 962.4 L 960.0 973.2 L 1040.0 987.7 L 1120.0 1000.5 L 1200.0 1005.7 L 1280.0 1000.4 L 1360.0 986.5 L 1440.0 970.0 L 1520.0 957.2 L 1600.0 951.2 L 1680.0 950.9 L 1760.0 952.8 L 1840.0 954.5 L 1920.0 956.5" }), _jsx("path", { d: "M 0.0 1019.7 L 80.0 1017.5 L 160.0 1005.0 L 240.0 986.7 L 320.0 969.8 L 400.0 960.1 L 480.0 959.0 L 560.0 963.7 L 640.0 969.6 L 720.0 974.5 L 800.0 979.3 L 880.0 986.7 L 960.0 998.0 L 1040.0 1010.7 L 1120.0 1019.2 L 1200.0 1018.4 L 1280.0 1007.0 L 1360.0 988.9 L 1440.0 971.5 L 1520.0 960.7 L 1600.0 958.8 L 1680.0 963.0 L 1760.0 968.9 L 1840.0 974.0 L 1920.0 978.7" }), _jsx("path", { d: "M 0.0 1032.6 L 80.0 1024.3 L 160.0 1007.0 L 240.0 986.9 L 320.0 971.9 L 400.0 966.9 L 480.0 971.4 L 560.0 981.1 L 640.0 990.6 L 720.0 997.7 L 800.0 1003.6 L 880.0 1011.1 L 960.0 1020.9 L 1040.0 1029.9 L 1120.0 1032.9 L 1200.0 1025.8 L 1280.0 1009.3 L 1360.0 989.2 L 1440.0 973.2 L 1520.0 966.9 L 1600.0 970.5 L 1680.0 979.9 L 1760.0 989.6 L 1840.0 997.0 L 1920.0 1002.9" }), _jsx("path", { d: "M 0.0 1040.3 L 80.0 1026.7 L 160.0 1006.7 L 240.0 987.6 L 320.0 977.0 L 400.0 978.3 L 480.0 989.2 L 560.0 1003.4 L 640.0 1015.3 L 720.0 1022.8 L 800.0 1027.8 L 880.0 1033.4 L 960.0 1039.9 L 1040.0 1044.2 L 1120.0 1041.3 L 1200.0 1028.8 L 1280.0 1009.1 L 1360.0 989.5 L 1440.0 977.6 L 1520.0 977.6 L 1600.0 987.6 L 1680.0 1001.8 L 1760.0 1014.1 L 1840.0 1022.1 L 1920.0 1027.3" })] }), _jsxs("g", { class: "archive-layer archive-layer--lineage", children: [_jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "0s", "--archive-duration": "34s" }, d: "M120 1030 C145 930 185 850 210 755 C235 660 240 565 270 470 C292 395 324 315 345 230" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "1.5s", "--archive-duration": "29s" }, d: "M195 820 C135 780 96 731 58 680" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "2.2s", "--archive-duration": "31s" }, d: "M220 750 C292 706 348 646 410 590" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "3.3s", "--archive-duration": "27s" }, d: "M235 675 C164 622 120 568 78 515" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "4.0s", "--archive-duration": "32s" }, d: "M250 615 C328 574 397 527 452 474" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "5.2s", "--archive-duration": "28s" }, d: "M265 542 C195 489 156 431 120 365" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "5.8s", "--archive-duration": "30s" }, d: "M286 465 C358 423 427 369 490 318" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "6.8s", "--archive-duration": "26s" }, d: "M304 402 C251 350 221 292 208 225" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "7.5s", "--archive-duration": "29s" }, d: "M321 338 C382 301 436 262 486 210" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "8.5s", "--archive-duration": "25s" }, d: "M337 275 C316 228 312 183 324 132" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "1.2s", "--archive-duration": "30s" }, d: "M188 848 C260 835 330 820 404 784" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "0.7s", "--archive-duration": "28s" }, d: "M147 930 C205 918 257 895 307 861" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "4.8s", "--archive-duration": "27s" }, d: "M410 590 C474 565 533 527 590 486" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "5.4s", "--archive-duration": "29s" }, d: "M452 474 C524 452 576 418 632 372" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "6.5s", "--archive-duration": "27s" }, d: "M490 318 C560 300 617 263 674 220" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "4.5s", "--archive-duration": "24s" }, d: "M78 515 C45 468 30 420 28 375" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "6.0s", "--archive-duration": "25s" }, d: "M120 365 C79 321 57 276 52 226" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "3.7s", "--archive-duration": "24s" }, d: "M58 680 C34 642 24 606 25 570" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "2.8s", "--archive-duration": "29s" }, d: "M404 784 C474 765 532 731 590 692" }), _jsx("path", { class: "archive-trace", pathLength: "1", style: { "--archive-delay": "2.0s", "--archive-duration": "27s" }, d: "M307 861 C365 848 422 821 475 790" }), _jsx("circle", { class: "archive-node archive-node--major", cx: "120", cy: "1030", r: "12" }), _jsx("circle", { class: "archive-node archive-node--minor", cx: "147", cy: "930", r: "7" }), _jsx("circle", { class: "archive-node archive-node--major", cx: "188", cy: "848", r: "10" }), _jsx("circle", { class: "archive-node archive-node--minor", cx: "220", cy: "750", r: "7" }), _jsx("circle", { class: "archive-node archive-node--major", cx: "235", cy: "675", r: "8" }), _jsx("circle", { class: "archive-node archive-node--minor", cx: "250", cy: "615", r: "6" }), _jsx("circle", { class: "archive-node archive-node--major", cx: "265", cy: "542", r: "8" }), _jsx("circle", { class: "archive-node archive-node--minor", cx: "286", cy: "465", r: "6" }), _jsx("circle", { class: "archive-node archive-node--major", cx: "304", cy: "402", r: "8" }), _jsx("circle", { class: "archive-node archive-node--minor", cx: "321", cy: "338", r: "6" }), _jsx("circle", { class: "archive-node archive-node--major", cx: "337", cy: "275", r: "8" }), _jsx("circle", { class: "archive-node archive-node--minor", cx: "345", cy: "230", r: "6" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "58", cy: "680", r: "5" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "78", cy: "515", r: "6" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "120", cy: "365", r: "5" }), _jsx("circle", { class: "archive-node archive-node--gold", cx: "410", cy: "590", r: "7" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "452", cy: "474", r: "7" }), _jsx("circle", { class: "archive-node archive-node--gold", cx: "490", cy: "318", r: "6" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "404", cy: "784", r: "6" }), _jsx("circle", { class: "archive-node archive-node--gold", cx: "307", cy: "861", r: "5" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "590", cy: "486", r: "5" }), _jsx("rect", { class: "archive-node archive-node--diamond", x: "627", y: "367", width: "10", height: "10", transform: "rotate(45 632 372)" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "674", cy: "220", r: "5" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "590", cy: "692", r: "5" }), _jsx("rect", { class: "archive-node archive-node--diamond", x: "470", y: "785", width: "10", height: "10", transform: "rotate(45 475 790)" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "324", cy: "132", r: "5" }), _jsx("rect", { class: "archive-node archive-node--diamond", x: "203", y: "220", width: "10", height: "10", transform: "rotate(45 208 225)" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "486", cy: "210", r: "5" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "52", cy: "226", r: "5" }), _jsx("rect", { class: "archive-node archive-node--diamond", x: "23", y: "370", width: "10", height: "10", transform: "rotate(45 28 375)" }), _jsx("circle", { class: "archive-node archive-node--open", cx: "25", cy: "570", r: "5" }), _jsx("circle", { class: "archive-traveler", r: "4", children: _jsx("animateMotion", { dur: "46s", repeatCount: "indefinite", begin: "8s", path: "M120 1030 C145 930 185 850 210 755 C235 660 240 565 270 470 C292 395 324 315 345 230" }) })] }), _jsxs("g", { class: "archive-layer archive-layer--documents", children: [_jsxs("g", { class: "archive-ledger", children: [_jsx("line", { x1: "1460", y1: "150", x2: "1460", y2: "750" }), _jsx("line", { x1: "1528", y1: "150", x2: "1528", y2: "750" }), _jsx("line", { x1: "1610", y1: "150", x2: "1610", y2: "750" }), _jsx("line", { x1: "1702", y1: "150", x2: "1702", y2: "750" }), _jsx("line", { x1: "1790", y1: "150", x2: "1790", y2: "750" }), _jsx("line", { x1: "1860", y1: "150", x2: "1860", y2: "750" }), _jsx("line", { x1: "1420", y1: "150", x2: "1900", y2: "150" }), _jsx("line", { x1: "1420", y1: "198", x2: "1900", y2: "198" }), _jsx("line", { x1: "1420", y1: "246", x2: "1900", y2: "246" }), _jsx("line", { x1: "1420", y1: "294", x2: "1900", y2: "294" }), _jsx("line", { x1: "1420", y1: "342", x2: "1900", y2: "342" }), _jsx("line", { x1: "1420", y1: "390", x2: "1900", y2: "390" }), _jsx("line", { x1: "1420", y1: "438", x2: "1900", y2: "438" }), _jsx("line", { x1: "1420", y1: "486", x2: "1900", y2: "486" }), _jsx("line", { x1: "1420", y1: "534", x2: "1900", y2: "534" }), _jsx("line", { x1: "1420", y1: "582", x2: "1900", y2: "582" }), _jsx("line", { x1: "1420", y1: "630", x2: "1900", y2: "630" }), _jsx("line", { x1: "1420", y1: "678", x2: "1900", y2: "678" }), _jsx("line", { x1: "1420", y1: "726", x2: "1900", y2: "726" })] }), _jsx("path", { class: "archive-manuscript", d: "M1418 420 C1500 390 1580 455 1660 420 S1810 390 1890 438 M1440 492 C1510 530 1600 470 1690 515 S1810 540 1880 500 M1450 595 C1530 552 1615 622 1710 578 S1820 560 1880 600" }), _jsxs("g", { class: "archive-cemetery", children: [_jsx("line", { x1: "1500", y1: "780", x2: "1370", y2: "1040" }), _jsx("line", { x1: "1558", y1: "780", x2: "1428", y2: "1040" }), _jsx("line", { x1: "1616", y1: "780", x2: "1486", y2: "1040" }), _jsx("line", { x1: "1674", y1: "780", x2: "1544", y2: "1040" }), _jsx("line", { x1: "1732", y1: "780", x2: "1602", y2: "1040" }), _jsx("line", { x1: "1790", y1: "780", x2: "1660", y2: "1040" }), _jsx("line", { x1: "1848", y1: "780", x2: "1718", y2: "1040" }), _jsx("line", { x1: "1435", y1: "790", x2: "1845", y2: "900" }), _jsx("line", { x1: "1435", y1: "838", x2: "1845", y2: "948" }), _jsx("line", { x1: "1435", y1: "886", x2: "1845", y2: "996" }), _jsx("line", { x1: "1435", y1: "934", x2: "1845", y2: "1044" }), _jsx("line", { x1: "1435", y1: "982", x2: "1845", y2: "1092" }), _jsx("line", { x1: "1435", y1: "1030", x2: "1845", y2: "1140" })] }), _jsx("circle", { cx: "1670", cy: "348", r: "54" }), _jsx("circle", { cx: "1670", cy: "348", r: "42" }), _jsx("path", { d: "M1670 302V394 M1624 348H1716 M1642 320L1698 376 M1698 320L1642 376" })] }), _jsxs("g", { class: "archive-layer archive-layer--routes", children: [_jsx("path", { class: "archive-route archive-route--inference", d: "M650 930 C780 870 860 980 980 920 S1205 820 1325 895 S1500 930 1630 860" }), _jsx("path", { class: "archive-route archive-route--unverified", d: "M800 1000 C920 942 1000 1032 1120 976 S1320 930 1450 995" }), _jsx("path", { class: "archive-route archive-route--unresolved", d: "M1180 930 C1320 860 1460 875 1590 945 S1745 995 1850 930" }), _jsx("circle", { cx: "980", cy: "920", r: "8" }), _jsx("circle", { cx: "1325", cy: "895", r: "8" }), _jsx("circle", { cx: "1630", cy: "860", r: "8" }), _jsx("rect", { x: "1841", y: "921", width: "18", height: "18", transform: "rotate(45 1850 930)" })] }), _jsx("rect", { class: "archive-center-veil", x: "360", y: "0", width: "1200", height: "1080", fill: "url(#archiveCenterVeil)" }), _jsx("rect", { class: "archive-vignette", x: "0", y: "0", width: "1920", height: "1080", fill: "url(#archiveVignette)" })] }) }));
};
ArchiveBackground.css = styles;
ArchiveBackground.afterDOMLoaded = script;
const ArchiveBackgroundConstructor = (() => ArchiveBackground);
export { ArchiveBackgroundConstructor as ArchiveBackground };
export default ArchiveBackgroundConstructor;
