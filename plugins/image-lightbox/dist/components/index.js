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
   Covers the entire browser viewport and provides scrolling
   when an image is displayed at its native dimensions.
   ========================================================= */

.quartz-image-lightbox {
  /* Keep the overlay attached to the browser viewport. */
  position: fixed;
  inset: 0;

  /*
   * Include padding inside the fixed viewport box. Without
   * border-box, inset: 0 plus padding makes the overlay larger
   * than the viewport and can clip native-size image edges.
   */
  box-sizing: border-box;

  /* Keep the lightbox above Quartz navigation and popovers. */
  z-index: 10000;

  /* Center fit-to-screen images horizontally and vertically. */
  display: grid;
  place-items: center;

  /* Permit scrolling when the image exceeds the viewport. */
  overflow: auto;

  /* Leave space around images and the close button. */
  padding: 2rem;

  /* Darken the page behind the displayed image. */
  background: rgb(0 0 0 / 92%);

  /* Hide the overlay until it receives the is-open class. */
  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  /* Fade the lightbox in and out. */
  transition:
    opacity 160ms ease,
    visibility 160ms ease;
}


/* =========================================================
   OPEN LIGHTBOX STATE
   Makes the overlay visible and interactive.
   ========================================================= */

.quartz-image-lightbox.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}


/* =========================================================
   FIT-TO-SCREEN IMAGE STATE
   This is the default state when the lightbox first opens.
   Large images are reduced enough to fit inside the viewport.
   ========================================================= */

.quartz-image-lightbox__image {
  display: block;

  /* Preserve the image's original aspect ratio. */
  width: auto;
  height: auto;

  /* Keep the initial view inside the browser viewport. */
  max-width: calc(100vw - 4rem);
  max-height: calc(100vh - 4rem);

  /* Prevent distortion when fitting the image to the screen. */
  object-fit: contain;

  /* Indicate that clicking will switch to native size. */
  cursor: zoom-in;

  /* Separate the image visually from the dark backdrop. */
  border-radius: 0.25rem;
  box-shadow: 0 1rem 4rem rgb(0 0 0 / 65%);
}


/* =========================================================
   NATIVE-SIZE OVERLAY STATE
   Removes grid centering so oversized images can extend
   beyond the viewport and be inspected by scrolling.
   ========================================================= */

.quartz-image-lightbox.is-actual-size {
  /* Allow the image to occupy its full natural dimensions. */
  display: block;

  /* Center images that are narrower than the viewport. */
  text-align: center;
}


/* =========================================================
   NATIVE-SIZE IMAGE STATE
   Displays the original image at one CSS pixel per image
   pixel, without viewport-based maximum dimensions.
   ========================================================= */

.quartz-image-lightbox.is-actual-size
  .quartz-image-lightbox__image {
  /* Remove all fit-to-screen restrictions. */
  width: auto;
  height: auto;
  max-width: none;
  max-height: none;

  /*
   * Keep horizontal centering for images narrower than the
   * viewport, but remove extra vertical margins that can
   * distort the scrollable bounds.
   */
  margin: 0 auto;

  /* Indicate that clicking returns to fit-to-screen mode. */
  cursor: zoom-out;
}


/* =========================================================
   CLOSE BUTTON
   Remains fixed in the upper-right corner while the image
   and overlay are scrolled.
   ========================================================= */

.quartz-image-lightbox__close {
  /* Keep the close control visible during overlay scrolling. */
  position: fixed;
  top: 1rem;
  right: 1rem;

  /* Center the multiplication-sign icon. */
  display: grid;
  place-items: center;

  /* Give the button a consistent circular click target. */
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;

  /* Make the control readable against the dark background. */
  color: white;
  font: inherit;
  font-size: 2rem;
  line-height: 1;

  /* Style the control as an interactive circular button. */
  cursor: pointer;
  background: rgb(25 25 25 / 85%);
  border: 1px solid rgb(255 255 255 / 40%);
  border-radius: 50%;
}


/* =========================================================
   CLOSE BUTTON HOVER STATE
   Provides visible feedback for pointer users.
   ========================================================= */

.quartz-image-lightbox__close:hover {
  background: rgb(55 55 55 / 95%);
}


/* =========================================================
   KEYBOARD FOCUS
   Makes both image triggers and the close button visibly
   accessible when navigating with the keyboard.
   ========================================================= */

.quartz-image-lightbox__close:focus-visible,
article img.quartz-lightbox-trigger:focus-visible {
  outline: 3px solid white;
  outline-offset: 3px;
}


/* =========================================================
   PAGE SCROLL LOCK
   Prevents the underlying Quartz page from scrolling while
   the lightbox is open. The overlay itself remains scrollable.
   ========================================================= */

html.quartz-lightbox-open,
html.quartz-lightbox-open body {
  overflow: hidden;
}


/* =========================================================
   MOBILE VIEWPORT ADJUSTMENTS
   Reduces unused padding on narrow screens.
   ========================================================= */

@media (max-width: 600px) {
  .quartz-image-lightbox {
    /* Preserve more screen space for the image on mobile. */
    padding: 1rem;
  }

  .quartz-image-lightbox__image {
    /* Fit the initial image view within the mobile viewport. */
    max-width: calc(100vw - 2rem);
    max-height: calc(100vh - 2rem);
  }

  .quartz-image-lightbox.is-actual-size
    .quartz-image-lightbox__image {
    /* Keep native-size mode unrestricted on mobile. */
    max-width: none;
    max-height: none;

    /* Avoid changing the native-size scrollable bounds. */
    margin: 0 auto;
  }
}


/* =========================================================
   REDUCED-MOTION SUPPORT
   Removes the fade transition for visitors who request less
   animation through their operating-system preferences.
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
      return overlay
    }

    overlay = document.createElement("div")
    overlay.id = overlayId
    overlay.className = "quartz-image-lightbox"
    overlay.setAttribute("role", "dialog")
    overlay.setAttribute("aria-modal", "true")
    overlay.setAttribute("aria-hidden", "true")
    overlay.setAttribute("aria-label", "Full-size image")

    const closeButton = document.createElement("button")
    closeButton.type = "button"
    closeButton.className = "quartz-image-lightbox__close"
    closeButton.setAttribute("aria-label", "Close full-size image")
    closeButton.textContent = "×"

    const fullImage = document.createElement("img")
    fullImage.className = "quartz-image-lightbox__image"
    fullImage.alt = ""

    overlay.append(closeButton, fullImage)
    document.body.appendChild(overlay)

    return overlay
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

      // Allow individual images to opt out with data-no-lightbox="true".
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

    const fullImage = overlay.querySelector(
      ".quartz-image-lightbox__image",
    )

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

    // Reset any scroll position left by a previously enlarged image.
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

    const fullImage = overlay.querySelector(
      ".quartz-image-lightbox__image",
    )

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

    const openingActualSize =
      !overlay.classList.contains("is-actual-size")

    overlay.classList.toggle("is-actual-size")

    if (openingActualSize) {
      /*
       * Start near the center of the full-size image. This is
       * useful when its natural dimensions exceed the screen.
       */
      requestAnimationFrame(() => {
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
      })
    } else {
      // Return the fitted image to the normal centered view.
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

      /*
       * Close when the visitor presses the close button or clicks
       * directly on the dark backdrop.
       */
      if (
        target.closest(".quartz-image-lightbox__close") ||
        target === overlay
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