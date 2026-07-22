const lightboxCss = `
article img.quartz-lightbox-trigger {
  cursor: zoom-in;
}

.quartz-image-lightbox {
  position: fixed;
  inset: 0;
  z-index: 10000;

  display: grid;
  place-items: center;

  padding: 2rem;
  background: rgb(0 0 0 / 92%);

  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  transition:
    opacity 160ms ease,
    visibility 160ms ease;
}

.quartz-image-lightbox.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.quartz-image-lightbox__image {
  display: block;

  width: auto;
  height: auto;
  max-width: calc(100vw - 4rem);
  max-height: calc(100vh - 4rem);

  object-fit: contain;
  border-radius: 0.25rem;
  box-shadow: 0 1rem 4rem rgb(0 0 0 / 65%);
}

.quartz-image-lightbox__close {
  position: fixed;
  top: 1rem;
  right: 1rem;

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

.quartz-image-lightbox__close:focus-visible,
article img.quartz-lightbox-trigger:focus-visible {
  outline: 3px solid white;
  outline-offset: 3px;
}

html.quartz-lightbox-open,
html.quartz-lightbox-open body {
  overflow: hidden;
}

@media (max-width: 600px) {
  .quartz-image-lightbox {
    padding: 1rem;
  }

  .quartz-image-lightbox__image {
    max-width: calc(100vw - 2rem);
    max-height: calc(100vh - 2rem);
  }
}

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

  const decorateImages = () => {
    document.querySelectorAll("article img").forEach((image) => {
      if (!(image instanceof HTMLImageElement)) return
      if (image.closest("#" + overlayId)) return
      if (image.dataset.noLightbox === "true") return

      image.classList.add("quartz-lightbox-trigger")

      if (!image.hasAttribute("tabindex")) {
        image.tabIndex = 0
      }

      image.setAttribute("role", "button")

      const label = image.alt.replace(/\|[LR]$/i, "").trim()

      image.setAttribute(
        "aria-label",
        label
          ? "Open full-size image: " + label
          : "Open full-size image",
      )
    })
  }

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

    fullImage.src = sourceImage.currentSrc || sourceImage.src
    fullImage.alt = sourceImage.alt || ""

    overlay.classList.add("is-open")
    overlay.setAttribute("aria-hidden", "false")
    document.documentElement.classList.add(
      "quartz-lightbox-open",
    )

    if (closeButton instanceof HTMLButtonElement) {
      closeButton.focus()
    }
  }

  const closeImage = () => {
    const overlay = document.getElementById(overlayId)

    if (!(overlay instanceof HTMLElement)) return
    if (!overlay.classList.contains("is-open")) return

    overlay.classList.remove("is-open")
    overlay.setAttribute("aria-hidden", "true")
    document.documentElement.classList.remove(
      "quartz-lightbox-open",
    )

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

  if (!window.__quartzImageLightboxBound) {
    window.__quartzImageLightboxBound = true

    document.addEventListener("click", (event) => {
      const target = event.target

      if (!(target instanceof Element)) return

      const overlay = document.getElementById(overlayId)

      if (
        target.closest(".quartz-image-lightbox__close") ||
        target === overlay
      ) {
        closeImage()
        return
      }

      if (
        target instanceof HTMLImageElement &&
        target.classList.contains("quartz-lightbox-trigger")
      ) {
        if (
          event instanceof MouseEvent &&
          (event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey)
        ) {
          return
        }

        event.preventDefault()
        openImage(target)
      }
    })

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeImage()
        return
      }

      const target = event.target

      if (
        (event.key === "Enter" || event.key === " ") &&
        target instanceof HTMLImageElement &&
        target.classList.contains("quartz-lightbox-trigger")
      ) {
        event.preventDefault()
        openImage(target)
      }
    })

    document.addEventListener("nav", decorateImages)
    document.addEventListener("render", decorateImages)
    document.addEventListener("prenav", closeImage)
  }

  ensureOverlay()
  decorateImages()
})()
`

export function ImageLightbox() {
  const Component = () => null

  Component.css = lightboxCss
  Component.afterDOMLoaded = lightboxScript

  return Component
}