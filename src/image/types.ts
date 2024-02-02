export type ImageFormat = "gif" | "jpeg" | "jpg" | "png" | "webp";

export const IMAGE_SOURCE = {
  placeholder: "placeholder",
  picsum: "picsum",
} as const;

export type ImageSource = (typeof IMAGE_SOURCE)[keyof typeof IMAGE_SOURCE];
