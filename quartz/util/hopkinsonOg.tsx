import type { SatoriOptions } from "satori/wasm"
import type { GlobalConfiguration } from "../cfg"

type FontSpecification =
  | string
  | {
      name?: string
    }

type DateValue = string | number | Date | undefined

type HopkinsonFrontmatter = {
  tags?: string[] | string
  page_type?: string
}

type HopkinsonFileData = {
  frontmatter?: HopkinsonFrontmatter
  dates?: {
    created?: DateValue
    modified?: DateValue
    published?: DateValue
  }
  text?: string
}

type HopkinsonOgOptions = {
  cfg: GlobalConfiguration
  userOpts: unknown
  title: string
  description: string
  fonts?: SatoriOptions["fonts"]
  fileData?: HopkinsonFileData
  iconBase64?: string
}

function getFontName(
  spec: FontSpecification | undefined,
  fallback: string,
): string {
  if (typeof spec === "string") return spec
  return spec?.name ?? fallback
}

function normalizeTags(tags: string[] | string | undefined): string[] {
  const values =
    typeof tags === "string"
      ? tags.split(",").map((tag) => tag.trim())
      : Array.isArray(tags)
        ? tags
        : []

  return values
    .map((tag) => tag.replace(/^#/, "").trim())
    .filter(Boolean)
    .slice(0, 4)
}

function getDisplayDate(
  fileData: HopkinsonFileData | undefined,
  locale: string,
): string | undefined {
  const raw =
    fileData?.dates?.modified ??
    fileData?.dates?.published ??
    fileData?.dates?.created

  if (raw === undefined) return undefined

  const date = raw instanceof Date ? raw : new Date(raw)
  if (Number.isNaN(date.getTime())) return undefined

  return new Intl.DateTimeFormat(locale || "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

function getReadingTime(text: string | undefined): string | undefined {
  const words = text?.trim().split(/\s+/).filter(Boolean).length ?? 0
  if (words === 0) return undefined
  return `${Math.max(1, Math.ceil(words / 220))} min read`
}

/**
 * Dynamic dark archival OG card for Quartz v5.
 *
 * Decorative vectors form the background. Quartz-supplied page data is
 * rendered above it: title, description, modified date, reading time, and tags.
 *
 * Save as: quartz/util/hopkinsonOg.tsx
 */
export const hopkinsonOg = ({
  cfg,
  title,
  description,
  fonts = [],
  fileData,
}: HopkinsonOgOptions) => {
  const displayTitle = title || "Hopkinson Family History"
  const displayDescription =
    description ||
    "A documentary archive of Hopkinson family genealogy, biographies, historical records, and continuing research."

  const theme = cfg.theme as {
    typography?: {
      header?: FontSpecification
      body?: FontSpecification
    }
  }

  const firstFontName = fonts[0]?.name ?? "sans-serif"
  const headerFontName = getFontName(
    theme.typography?.header,
    firstFontName,
  )
  const bodyFallback =
    fonts.find((font) => font.name !== headerFontName)?.name ??
    firstFontName
  const bodyFontName = getFontName(
    theme.typography?.body,
    bodyFallback,
  )

  const titleSize =
    displayTitle.length > 64 ? 48 :
    displayTitle.length > 46 ? 56 :
    displayTitle.length > 30 ? 64 : 72

  const tags = normalizeTags(fileData?.frontmatter?.tags)
  const displayDate = getDisplayDate(fileData, cfg.locale)
  const readingTime = getReadingTime(fileData?.text)
  const metadata = [displayDate, readingTime].filter(
    (value): value is string => Boolean(value),
  )

  const nodes = [
    [70, 530, 10], [110, 468, 8], [138, 398, 10], [158, 332, 8],
    [154, 264, 9], [127, 204, 7], [98, 144, 6], [220, 371, 6],
    [285, 330, 6], [345, 282, 6], [227, 291, 6], [308, 240, 6],
    [380, 175, 6], [392, 385, 7],
  ]

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(circle at 67% 42%, #1a272c 0%, #11171b 72%)",
        color: "#e7e0cf",
        fontFamily: bodyFontName,
      }}
    >
      {/* BACKGROUND ART */}
      <div
        style={{
          position: "absolute",
          inset: "24px",
          display: "flex",
          border: "2px solid rgba(102,134,139,.56)",
          borderRadius: "28px",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "38px",
          display: "flex",
          border: "1px solid rgba(196,166,106,.28)",
          borderRadius: "22px",
        }}
      />

      <svg
        width="455"
        height="630"
        viewBox="0 0 455 630"
        style={{ position: "absolute", left: 0, top: 0 }}
      >
        <g fill="none" stroke="#66868b" strokeWidth="3" opacity=".88">
          <path d="M70 530C110 468 138 398 158 332S154 264 127 204S98 144 98 144" />
          <path d="M138 398C220 371 285 330 345 282" />
          <path d="M158 332C227 291 308 240 380 175" />
          <path d="M154 264C204 225 252 176 284 118" />
          <path d="M110 468C210 451 302 423 392 385" />
          <path d="M127 204C169 165 201 123 201 123" />
        </g>

        {nodes.map(([cx, cy, r], index) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={r}
            fill={[2, 6, 12, 13].includes(index) ? "#c4a66a" : "#89aeb2"}
            stroke="#e7e0cf"
            strokeWidth="2"
          />
        ))}
      </svg>

      <div
        style={{
          position: "absolute",
          right: "34px",
          top: "66px",
          width: "440px",
          height: "500px",
          display: "flex",
          opacity: 0.24,
          backgroundImage:
            "linear-gradient(#29383c 1px, transparent 1px), linear-gradient(90deg, #29383c 1px, transparent 1px)",
          backgroundSize: "54px 46px",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "425px",
          top: "70px",
          width: "2px",
          height: "490px",
          display: "flex",
          backgroundColor: "rgba(196,166,106,.72)",
        }}
      />

      {/* DYNAMIC CONTENT */}
      <div
        style={{
          position: "absolute",
          left: "472px",
          top: "62px",
          width: "665px",
          height: "505px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            padding: "8px 18px",
            border: "1px solid rgba(137,174,178,.52)",
            borderRadius: "17px",
            backgroundColor: "rgba(28,43,47,.92)",
            color: "#89aeb2",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "1.4px",
          }}
        >
          HOPKINSON DOCUMENTARY ARCHIVE
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "26px",
            maxWidth: "650px",
            color: "#e7e0cf",
            fontFamily: headerFontName,
            fontSize: `${titleSize}px`,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-1px",
            lineClamp: 2,
          }}
        >
          {displayTitle}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "20px",
            maxWidth: "620px",
            color: "#a9b0ab",
            fontFamily: bodyFontName,
            fontSize: "26px",
            lineHeight: 1.38,
            lineClamp: 3,
          }}
        >
          {displayDescription}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              minHeight: "28px",
              color: "#a9b0ab",
              fontSize: "18px",
            }}
          >
            {metadata.map((value, index) => (
              <div
                key={value}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {index > 0 && (
                  <div
                    style={{
                      display: "flex",
                      margin: "0 12px",
                      color: "#c4a66a",
                    }}
                  >
                    •
                  </div>
                )}
                <div style={{ display: "flex" }}>{value}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              marginTop: "14px",
              paddingTop: "17px",
              borderTop: "1px solid rgba(137,174,178,.38)",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                maxWidth: "470px",
              }}
            >
              {tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    display: "flex",
                    padding: "6px 11px",
                    border: "1px solid rgba(137,174,178,.34)",
                    borderRadius: "12px",
                    backgroundColor: "rgba(137,174,178,.10)",
                    color: "#b9ccca",
                    fontSize: "15px",
                    lineHeight: 1,
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                marginLeft: "14px",
                color: "#89aeb2",
                fontSize: "16px",
                whiteSpace: "nowrap",
              }}
            >
              hopkinsonarchive.github.io
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
