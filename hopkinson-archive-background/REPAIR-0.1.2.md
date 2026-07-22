# Repair to v0.1.2

This release fixes component registration. Earlier packages installed successfully but did not declare a named Quartz component or the required `./components` export.

Replace the contents of the existing `hopkinson-archive-background` directory with this release, preserving the directory name. Then rebuild Quartz.

Expected configuration:

```yaml
  - source: ./hopkinson-archive-background
    enabled: true
    options:
      enabled: true
      motion: true
      intensity: 1
      defaultVariant: default
    order: 50
    layout:
      position: beforeBody
      priority: -1000
```

Verification:

```powershell
Select-String -Path ".\public\index.html" -Pattern "archive-background"
Select-String -Path ".\public\index.css" -Pattern "--archive-canvas"
```
