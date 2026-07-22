const styles = String.raw`
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
`

export default styles
