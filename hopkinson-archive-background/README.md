# Hopkinson Archive Background

A Quartz v5 component plugin providing a text-free, responsive archival background for the Hopkinson Family History.

## Design constraints

- No generated names, dates, places, quotations, or simulated evidence.
- Shared vector geometry with independently tuned light and dark palettes.
- Central reading field remains subdued.
- Animation is slow and decorative only.
- `prefers-reduced-motion` disables drawing, pulsing, and traveling-node effects.
- Pointer events are disabled so the layer cannot obstruct links or selections.

## Install locally

Place this folder beside the Quartz repository, then run from the Quartz repository root:

```powershell
npx quartz plugin add ..\hopkinson-archive-background
```

Quartz v5 symlinks local plugins into `.quartz/plugins`, so later source changes are reflected after rebuilding.

Add or confirm this entry in `quartz.config.yaml`:

```yaml
plugins:
  - source: ../hopkinson-archive-background
    enabled: true
    options:
      motion: true
      intensity: 1
      defaultVariant: default
    layout:
      position: beforeBody
      priority: -1000
```

Then run:

```powershell
npx quartz build --serve
```

## Page variants

A page may explicitly select a composition:

```yaml
archive_background: person
```

Allowed values:

- `home`
- `person`
- `lineage`
- `research`
- `standards`
- `default`

Without that field, the component infers common variants from `page_type` and the page slug.

## Options

| Option | Type | Default | Purpose |
|---|---|---:|---|
| `enabled` | boolean | `true` | Enables the component. |
| `motion` | boolean | `true` | Enables slow line and node animation. |
| `intensity` | number | `1` | Overall opacity multiplier, clamped from `0.35` to `1.4`. |
| `defaultVariant` | string | `default` | Fallback composition. |

## Files

- `src/index.tsx` — component and inline SVG geometry
- `src/styles.ts` — responsive themes, animation, and variants
- `src/script.ts` — Quartz theme synchronization using `themechange`, `nav`, and `render`
- `previews/archive-background-light.svg` — static light reference
- `previews/archive-background-dark.svg` — static dark reference

## Prebuilt distribution

Version 0.1.1 includes `dist/index.js` and `dist/index.d.ts`. Quartz v5 should therefore skip dependency installation and plugin compilation when adding this local plugin.

## Quartz registration

Version 0.1.2 declares `ArchiveBackground` in the Quartz component manifest and exposes it through the required `./components` package subpath. This allows Quartz v5 to register and mount the component from `quartz.config.yaml`.
