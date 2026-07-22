import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import * as ExternalPlugin from "./.quartz/plugins"
import { hopkinsonOg } from "./quartz/util/hopkinsonOg"

ExternalPlugin.CustomOgImages({
  colorScheme: "darkMode",
  width: 1200,
  height: 630,
  excludeRoot: false,
  imageStructure: hopkinsonOg,
})
const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
