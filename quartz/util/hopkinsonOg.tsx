import type { SatoriOptions } from "satori/wasm"
import type { GlobalConfiguration } from "../cfg"

type FontSpecification =
  | string
  | {
      name?: string
    }

type HopkinsonOgOptions = {
  cfg: GlobalConfiguration
  userOpts: unknown
  title: string
  description: string
  fonts?: SatoriOptions["fonts"]
  fileData: unknown
  iconBase64?: string
}

function getFontName(spec: FontSpecification | undefined, fallback: string): string {
  if (typeof spec === "string") return spec
  return spec?.name ?? fallback
}

/**
 * Dark archival social card for the Hopkinson Family History.
 * Save as: quartz/util/hopkinsonOg.tsx
 *
 * Quartz v5's current OG plugin passes one object argument:
 * { cfg, userOpts, title, description, fonts, fileData, iconBase64 }
 */
export const hopkinsonOg = ({
  cfg,
  title,
  description,
  fonts = [],
}: HopkinsonOgOptions) => {
  const displayTitle = title || "Hopkinson Family History"
  const displayDescription =
    description ||
    "A documentary archive of Hopkinson family genealogy, biographies, historical records, and continuing research."

  const titleSize =
    displayTitle.length > 52 ? 56 :
    displayTitle.length > 34 ? 64 : 74

  const theme = cfg.theme as {
    typography?: {
      header?: FontSpecification
      body?: FontSpecification
    }
  }

  const firstFontName = fonts[0]?.name ?? "sans-serif"
  const headerFontName = getFontName(theme.typography?.header, firstFontName)
  const bodyFallback =
    fonts.find((font) => font.name !== headerFontName)?.name ??
    firstFontName
  const bodyFontName = getFontName(theme.typography?.body, bodyFallback)

  const nodes = [
    [82, 530, 10], [119, 468, 8], [142, 398, 10], [160, 332, 8],
    [154, 264, 9], [127, 204, 7], [98, 144, 6], [222, 371, 6],
    [287, 330, 6], [347, 282, 6], [229, 291, 6], [310, 240, 6],
    [382, 175, 6], [393, 385, 7],
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
          "radial-gradient(circle at 62% 44%, #172126 0%, #11171b 72%)",
        color: "#e7e0cf",
        fontFamily: bodyFontName,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "24px",
          display: "flex",
          border: "2px solid rgba(102,134,139,.55)",
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
        <g fill="none" stroke="#66868b" strokeWidth="3" opacity=".9">
          <path d="M82 530C119 468 142 398 160 332S154 264 127 204S98 144 98 144" />
          <path d="M142 398C222 371 287 330 347 282" />
          <path d="M160 332C229 291 310 240 382 175" />
          <path d="M154 264C204 225 252 176 284 118" />
          <path d="M119 468C212 451 303 423 393 385" />
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
          right: "36px",
          top: "80px",
          width: "370px",
          height: "470px",
          display: "flex",
          opacity: 0.32,
          backgroundImage:
            "linear-gradient(#29383c 1px, transparent 1px), linear-gradient(90deg, #29383c 1px, transparent 1px)",
          backgroundSize: "54px 46px",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "452px",
          top: "95px",
          width: "10px",
          height: "410px",
          display: "flex",
          borderRadius: "5px",
          backgroundColor: "#c4a66a",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "500px",
          top: "92px",
          display: "flex",
          padding: "9px 22px",
          border: "1px solid rgba(137,174,178,.55)",
          borderRadius: "18px",
          backgroundColor: "#1c2b2f",
          color: "#89aeb2",
          fontSize: "18px",
          fontWeight: 700,
          letterSpacing: "1.5px",
        }}
      >
        DOCUMENTARY FAMILY ARCHIVE
      </div>

      <div
        style={{
          position: "absolute",
          left: "500px",
          top: "150px",
          width: "620px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#e7e0cf",
            fontFamily: headerFontName,
            fontSize: `${titleSize}px`,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-1px",
          }}
        >
          {displayTitle}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "28px",
            maxWidth: "590px",
            color: "#a9b0ab",
            fontFamily: bodyFontName,
            fontSize: "29px",
            lineHeight: 1.38,
            lineClamp: 3,
          }}
        >
          {displayDescription}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "34px",
            paddingTop: "24px",
            borderTop: "2px solid rgba(137,174,178,.45)",
            color: "#89aeb2",
            fontFamily: bodyFontName,
            fontSize: "20px",
          }}
        >
          hopkinsonarchive.github.io/hopkinson-family-history
        </div>
      </div>
    </div>
  )
}