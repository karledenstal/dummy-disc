import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { user_route } from "./users/route";
import { image_route } from "./image/route";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .get("/health", ({ set }) => (set.status = "OK"))
  .group("/api", (app) => app.use(user_route).use(image_route));

app.listen("3000");

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
