const lightboxCss = `
/* =========================================================
   ARTICLE IMAGE TRIGGERS
   Adds a zoom cursor to article images handled by the
   lightbox plugin.
   ========================================================= */

article img.quartz-lightbox-trigger {
  cursor: zoom-in;
}


/* =========================================================
   LIGHTBOX OVERLAY
   The overlay itself is the scroll container. A separate
   stage controls centering without creating unreachable
   negative overflow in native-size mode.
   ========================================================= */

.quartz-image-lightbox {
  position: fixed;
  inset: 0;
  z-index: 10000;

  display: block;
  overflow: auto;
  box-sizing: border-box;
  padding: 0;

  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;

  background: rgb(0 0 0 / 92%);

  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  transition:
    opacity 160ms ease,
    visibility 160ms ease;
}


/* =========================================================
   OPEN LIGHTBOX STATE
   ========================================================= */

.quartz-image-lightbox.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}


/* =========================================================
   IMAGE STAGE
   In fit mode, this stage matches the viewport and centers
   the image. In native-size mode, it expands to contain the
   complete natural-size image while retaining scrollable
   padding on every edge.
   ========================================================= */

.quartz-image-lightbox__stage {
  display: grid;
  place-items: center;

  width: 100%;
  min-width: 100%;
  height: 100%;
  min-height: 100%;

  box-sizing: border-box;
  padding: 2rem;
}


/* =========================================================
   FIT-TO-SCREEN IMAGE STATE
   ========================================================= */

.quartz-image-lightbox__image {
  display: block;
  flex: none;

  width: auto;
  height: auto;

  max-width: calc(100vw - 4rem);
  max-height: calc(100vh - 4rem);

  object-fit: contain;
  cursor: zoom-in;

  border-radius: 0.25rem;
  box-shadow: 0 1rem 4rem rgb(0 0 0 / 65%);
}


/* =========================================================
   NATIVE-SIZE STAGE
   width/height: max-content makes the scrollable area expand
   to the full image dimensions. min-width/min-height keep
   smaller images centered in the viewport.
   ========================================================= */

.quartz-image-lightbox.is-actual-size
  .quartz-image-lightbox__stage {
  width: max-content;
  min-width: 100%;

  height: max-content;
  min-height: 100%;

  place-items: center;
}


/* =========================================================
   NATIVE-SIZE IMAGE STATE
   No viewport maximums are applied. The stage supplies the
   surrounding padding, so no image edge becomes unreachable.
   ========================================================= */

.quartz-image-lightbox.is-actual-size
  .quartz-image-lightbox__image {
  width: auto;
  height: auto;

  max-width: none;
  max-height: none;

  margin: 0;
  padding: 0;

  object-fit: none;
  cursor: zoom-out;
}


/* =========================================================
   CLOSE BUTTON
   ========================================================= */

.quartz-image-lightbox__close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1;

  display: grid;
  place-items: center;

  width: 2.75rem;
  height: 2.75rem;
  padding: 0;

  color: white;
  font: inherit;
  font-size: 2rem;
  line-height: 1;

  cursor: pointer;
  background: rgb(25 25 25 / 85%);
  border: 1px solid rgb(255 255 255 / 40%);
  border-radius: 50%;
}

.quartz-image-lightbox__close:hover {
  background: rgb(55 55 55 / 95%);
}


/* =========================================================
   KEYBOARD FOCUS
   ========================================================= */

.quartz-image-lightbox__close:focus-visible,
article img.quartz-lightbox-trigger:focus-visible {
  outline: 3px solid white;
  outline-offset: 3px;
}


/* =========================================================
   PAGE SCROLL LOCK
   ========================================================= */

html.quartz-lightbox-open,
html.quartz-lightbox-open body {
  overflow: hidden;
}


/* =========================================================
   MOBILE VIEWPORT ADJUSTMENTS
   ========================================================= */

@media (max-width: 600px) {
  .quartz-image-lightbox__stage {
    padding: 1rem;
  }

  .quartz-image-lightbox__image {
    max-width: calc(100vw - 2rem);
    max-height: calc(100vh - 2rem);
  }

  .quartz-image-lightbox.is-actual-size
    .quartz-image-lightbox__image {
    max-width: none;
    max-height: none;
  }
}


/* =========================================================
   REDUCED-MOTION SUPPORT
   ========================================================= */

@media (prefers-reduced-motion: reduce) {
  .quartz-image-lightbox {
    transition: none;
  }
}
`

const lightboxScript = String.raw`
(() => {
  const overlayId = "quartz-image-lightbox"
  let lastTrigger = null

  /**
   * Creates the lightbox overlay once and reuses it across
   * Quartz SPA navigation events.
   */
  const ensureOverlay = () => {
    let overlay = document.getElementById(overlayId)

    if (overlay instanceof HTMLElement) {
      const existingStage = overlay.querySelector(
        ".quartz-image-lightbox__stage",
      )

      const existingImage = overlay.querySelector(
        ".quartz-image-lightbox__image",
      )

      const existingClose = overlay.querySelector(
        ".quartz-image-lightbox__close",
      )

      if (
        existingStage instanceof HTMLElement &&
        existingImage instanceof HTMLImageElement &&
        existingClose instanceof HTMLButtonElement
      ) {
        return overlay
      }

      // Remove an overlay created by an older plugin version.
      overlay.remove()
    }

    overlay = document.createElement("div")
    overlay.id = overlayId
    overlay.className = "quartz-image-lightbox"
    overlay.setAttribute("role", "dialog")
    overlay.setAttribute("aria-modal", "true")
    overlay.setAttribute("aria-hidden", "true")
    overlay.setAttribute("aria-label", "Full-size image")

    const stage = document.createElement("div")
    stage.className = "quartz-image-lightbox__stage"

    const closeButton = document.createElement("button")
    closeButton.type = "button"
    closeButton.className = "quartz-image-lightbox__close"
    closeButton.setAttribute("aria-label", "Close full-size image")
    closeButton.textContent = "×"

    const fullImage = document.createElement("img")
    fullImage.className = "quartz-image-lightbox__image"
    fullImage.alt = ""

    stage.appendChild(fullImage)
    overlay.append(stage, closeButton)
    document.body.appendChild(overlay)

    return overlay
  }

  /**
   * Returns the lightbox image from the supplied overlay.
   */
  const getFullImage = (overlay) => {
    const image = overlay.querySelector(
      ".quartz-image-lightbox__image",
    )

    return image instanceof HTMLImageElement ? image : null
  }

  /**
   * Centers the viewport over the native-size image.
   *
   * The stage starts at a valid top-left scroll origin, so all
   * four image edges remain reachable after centering.
   */
  const centerActualSize = (overlay) => {
    overlay.scrollTo({
      top: Math.max(
        0,
        (overlay.scrollHeight - overlay.clientHeight) / 2,
      ),
      left: Math.max(
        0,
        (overlay.scrollWidth - overlay.clientWidth) / 2,
      ),
      behavior: "auto",
    })
  }

  /**
   * Centers after layout has incorporated the natural image
   * dimensions. Two animation frames avoid measuring the old
   * fit-to-screen layout.
   */
  const scheduleActualSizeCenter = (overlay, fullImage) => {
    const center = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          centerActualSize(overlay)
        })
      })
    }

    if (fullImage.complete && fullImage.naturalWidth > 0) {
      center()
      return
    }

    fullImage.addEventListener("load", center, { once: true })
  }

  /**
   * Marks article images as lightbox triggers and provides
   * keyboard-accessible labels and controls.
   */
  const decorateImages = () => {
    document.querySelectorAll("article img").forEach((image) => {
      if (!(image instanceof HTMLImageElement)) return

      // Do not recursively decorate the image inside the lightbox.
      if (image.closest("#" + overlayId)) return

      // Allow individual images to opt out.
      if (image.dataset.noLightbox === "true") return

      image.classList.add("quartz-lightbox-trigger")

      if (!image.hasAttribute("tabindex")) {
        image.tabIndex = 0
      }

      image.setAttribute("role", "button")

      // Remove the custom |L or |R alignment suffix from the label.
      const label = image.alt.replace(/\|[LR]$/i, "").trim()

      image.setAttribute(
        "aria-label",
        label
          ? "Open full-size image: " + label
          : "Open full-size image",
      )
    })
  }

  /**
   * Opens an article image in fit-to-screen mode.
   */
  const openImage = (sourceImage) => {
    const overlay = ensureOverlay()
    const fullImage = getFullImage(overlay)

    const closeButton = overlay.querySelector(
      ".quartz-image-lightbox__close",
    )

    if (!(fullImage instanceof HTMLImageElement)) return

    lastTrigger = sourceImage

    // Use the browser-selected source when srcset is present.
    fullImage.src = sourceImage.currentSrc || sourceImage.src
    fullImage.alt = sourceImage.alt || ""

    // Every newly opened image begins fitted to the viewport.
    overlay.classList.remove("is-actual-size")

    overlay.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    })

    overlay.classList.add("is-open")
    overlay.setAttribute("aria-hidden", "false")

    document.documentElement.classList.add(
      "quartz-lightbox-open",
    )

    if (closeButton instanceof HTMLButtonElement) {
      closeButton.focus()
    }
  }

  /**
   * Closes the overlay and restores focus to the article image
   * that originally opened it.
   */
  const closeImage = () => {
    const overlay = document.getElementById(overlayId)

    if (!(overlay instanceof HTMLElement)) return
    if (!overlay.classList.contains("is-open")) return

    overlay.classList.remove("is-open")
    overlay.classList.remove("is-actual-size")
    overlay.setAttribute("aria-hidden", "true")

    document.documentElement.classList.remove(
      "quartz-lightbox-open",
    )

    overlay.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    })

    const fullImage = getFullImage(overlay)

    if (fullImage instanceof HTMLImageElement) {
      fullImage.removeAttribute("src")
      fullImage.alt = ""
    }

    if (lastTrigger instanceof HTMLElement) {
      lastTrigger.focus()
    }

    lastTrigger = null
  }

  /**
   * Switches the displayed image between fit-to-screen mode
   * and its original native dimensions.
   */
  const toggleActualSize = () => {
    const overlay = document.getElementById(overlayId)

    if (!(overlay instanceof HTMLElement)) return

    const fullImage = getFullImage(overlay)

    if (!(fullImage instanceof HTMLImageElement)) return

    const openingActualSize =
      !overlay.classList.contains("is-actual-size")

    overlay.classList.toggle("is-actual-size")

    if (openingActualSize) {
      scheduleActualSizeCenter(overlay, fullImage)
    } else {
      overlay.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      })
    }
  }

  /*
   * Bind global handlers once. This avoids duplicated listeners
   * as Quartz replaces article content during SPA navigation.
   */
  if (!window.__quartzImageLightboxBound) {
    window.__quartzImageLightboxBound = true

    document.addEventListener("click", (event) => {
      const target = event.target

      if (!(target instanceof Element)) return

      const overlay = document.getElementById(overlayId)

      if (!(overlay instanceof HTMLElement)) return

      const stage = overlay.querySelector(
        ".quartz-image-lightbox__stage",
      )

      /*
       * Close when the visitor presses the close button or clicks
       * an empty part of the dark backdrop/stage.
       */
      if (
        target.closest(".quartz-image-lightbox__close") ||
        target === overlay ||
        target === stage
      ) {
        closeImage()
        return
      }

      /*
       * Clicking the displayed lightbox image switches between
       * fit-to-screen and native-size modes.
       */
      if (
        target instanceof HTMLImageElement &&
        target.classList.contains(
          "quartz-image-lightbox__image",
        )
      ) {
        event.preventDefault()
        toggleActualSize()
        return
      }

      /*
       * Clicking a decorated article image opens the lightbox.
       * Modifier-key clicks retain the browser's normal behavior.
       */
      if (
        target instanceof HTMLImageElement &&
        target.classList.contains("quartz-lightbox-trigger")
      ) {
        if (
          event instanceof MouseEvent &&
          (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
          )
        ) {
          return
        }

        event.preventDefault()
        openImage(target)
      }
    })

    document.addEventListener("keydown", (event) => {
      // Escape always closes an open lightbox.
      if (event.key === "Escape") {
        closeImage()
        return
      }

      const target = event.target

      /*
       * Enter or Space opens a focused article image, matching
       * expected keyboard-button behavior.
       */
      if (
        (event.key === "Enter" || event.key === " ") &&
        target instanceof HTMLImageElement &&
        target.classList.contains("quartz-lightbox-trigger")
      ) {
        event.preventDefault()
        openImage(target)
      }
    })

    /*
     * Re-decorate images whenever Quartz changes page content or
     * dynamically renders part of the current page.
     */
    document.addEventListener("nav", decorateImages)
    document.addEventListener("render", decorateImages)

    // Close the lightbox before Quartz begins navigating.
    document.addEventListener("prenav", closeImage)
  }

  ensureOverlay()
  decorateImages()
})()
`

export function ImageLightbox() {
  /*
   * The component renders no permanent visible page element.
   * Its CSS and browser script provide all lightbox behavior.
   */
  const Component = () => null

  Component.css = lightboxCss
  Component.afterDOMLoaded = lightboxScript

  return Component
}
