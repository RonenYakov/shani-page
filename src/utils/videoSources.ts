export type VideoFormat = "webm" | "mp4";

export type VideoSourceDefinition = {
  basePath: string;
  formats?: VideoFormat[];
};

export const DEFAULT_FORMATS: VideoFormat[] = ["webm", "mp4"];

export const buildResponsiveSources = (
  basePath: string,
  formats: VideoFormat[] = DEFAULT_FORMATS
) => {
  return formats.map((format) => ({
    type: `video/${format}`,
    src720: `${basePath}-720.${format}`,
    src1080: `${basePath}-1080.${format}`,
  }));
};

export type InferSources<T extends ReadonlyArray<string>> = {
  [K in keyof T]: ReturnType<typeof buildResponsiveSources>;
};

export type LazyVideoSources = ReturnType<typeof buildResponsiveSources>;


