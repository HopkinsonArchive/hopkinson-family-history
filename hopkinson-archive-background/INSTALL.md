# Installation Walkthrough

## 1. Keep the plugin outside Quartz

Recommended layout:

```text
Family-History/
├── quartz/
└── hopkinson-archive-background/
```

This keeps the visual system independent of Quartz upgrades.

## 2. Install it as a local Quartz v5 plugin

Open PowerShell in `Family-History/quartz`:

```powershell
npx quartz plugin add ..\hopkinson-archive-background
```

Quartz should report that the local plugin was added and symlinked.

## 3. Configure layout placement

Open `quartz.config.yaml`. Add the plugin to the existing `plugins:` list. Do not create a second `plugins:` key.

```yaml
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

The very low priority places the fixed visual layer before ordinary before-body components without replacing them.

## 4. Build and inspect both themes

```powershell
npx quartz build --serve
```

Review:

- home page in light mode;
- home page in dark mode;
- a long person biography in both modes;
- mobile width around 390 pixels;
- reduced-motion mode in the operating system or browser developer tools.

## 5. Apply variants selectively

Examples:

```yaml
archive_background: person
```

```yaml
archive_background: lineage
```

The visual variant does not encode factual relationships. It only changes emphasis among abstract vector layers.

## 6. Tune without editing geometry

First adjust only:

```yaml
options:
  intensity: 0.8
```

Recommended range for testing: `0.65` to `1.05`.

## 7. Later refinements

After the component is stable, the geometry may be split into additional optional layers, such as historically accurate map outlines or a dedicated lineage-page diagram. Those should remain separate from the global decorative background.
