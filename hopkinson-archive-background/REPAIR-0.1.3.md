# Repair 0.1.3

This release corrects two integration defects:

1. The fixed SVG had been painted above Quartz content. It now sits behind the page stacking context and cannot intercept pointer input.
2. Theme synchronization now reads Quartz theme attributes, local storage, the official `themechange` event, and attribute changes on the root element.

The palette geometry remains shared, while light and dark values remain independently tuned.
