import type { QuartzComponentConstructor } from "@quartz-community/types";

export interface ArchiveBackgroundOptions {
  enabled?: boolean;
  motion?: boolean;
  intensity?: number;
  defaultVariant?: "home" | "person" | "lineage" | "research" | "standards" | "default";
}

export declare function init(options?: ArchiveBackgroundOptions): void;
declare const ArchiveBackgroundConstructor: QuartzComponentConstructor<ArchiveBackgroundOptions>;
export { ArchiveBackgroundConstructor as ArchiveBackground };
export default ArchiveBackgroundConstructor;
