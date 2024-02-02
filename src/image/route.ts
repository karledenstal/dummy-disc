import { Elysia } from "elysia";
import { IMAGE_SOURCE, ImageFormat, ImageSource } from "./types";
import { faker } from "@faker-js/faker";

export const image_route = new Elysia({ prefix: "/image" }).get(
  "/",
  ({ query }) => {
    const width = parseInt(query.width as string, 10) || 100;
    const height = parseInt(query.height as string, 10) || 100;
    const format = (query.format as ImageFormat) || "png";
    const bg_color = (query.bgColor as string) || "#000000";
    const source = (query.source as ImageSource) || IMAGE_SOURCE.placeholder;
    const grayscale = query.grayscale === "true";

    if (source === IMAGE_SOURCE.picsum) {
      return faker.image.urlPicsumPhotos({
        width,
        height,
        grayscale,
      });
    }

    return faker.image
      .urlPlaceholder({
        width,
        height,
        format,
        backgroundColor: bg_color,
      })
      .replace(/[?&]text=[^&]*/, "");
  }
);
