import { Elysia } from "elysia";
import { faker } from "@faker-js/faker";

const TOTAL_ITEMS = 1000;

const ID_TYPES = {
  uuid: "uuid",
  plain: "plain",
  objectid: "objectid",
} as const;

type ImageFormat = "gif" | "jpeg" | "jpg" | "png" | "webp";

const ImageSource = {
  placeholder: "placeholder",
  picsum: "picsum",
} as const;

type ImageSource = (typeof ImageSource)[keyof typeof ImageSource];

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/health", ({ set }) => (set.status = "OK"))
  .group("/api", (app) =>
    app
      .get("/users", ({ query }) => {
        const limit = parseInt(query.limit as string, 10) || 10;
        const page = parseInt(query.page as string, 10) || 1;
        const max_limit = parseInt(query.total as string, 10) || TOTAL_ITEMS;
        const id_type = query.idType || ID_TYPES.plain;

        const offset = (page - 1) * limit;

        return {
          limit,
          page,
          totalPages: Math.ceil(max_limit / limit),
          users: Array.from(
            { length: Math.min(limit, max_limit - offset) },
            (_, i) => {
              const firstName = faker.person.firstName();
              const lastName = faker.person.lastName();

              let id: string | number = i + 1;

              if (id_type === ID_TYPES.uuid) {
                id = faker.string.uuid();
              } else if (id_type === ID_TYPES.objectid) {
                id = faker.database.mongodbObjectId();
              }

              return {
                id,
                name: `${firstName} ${lastName}`,
                username: faker.internet.userName({ firstName, lastName }),
                email: faker.internet.email({ firstName, lastName }),
                phoneNumber: faker.phone.number(),
                address: {
                  street: faker.location.streetAddress(),
                  city: faker.location.city(),
                  zipCode: faker.location.zipCode(),
                  geo: {
                    lat: faker.location.latitude(),
                    lng: faker.location.longitude(),
                  },
                },
                company: faker.company.name(),
                jobTitle: faker.person.jobTitle(),
              };
            }
          ),
        };
      })
      .get("/users/:id", ({ params: { id }, query }) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        return {
          id,
          name: `${firstName} ${lastName}`,
          username: faker.internet.userName({ firstName, lastName }),
          email: faker.internet.email({ firstName, lastName }),
          phoneNumber: faker.phone.number(),
          address: {
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            zipCode: faker.location.zipCode(),
            geo: {
              lat: faker.location.latitude(),
              lng: faker.location.longitude(),
            },
          },
          company: faker.company.name(),
          jobTitle: faker.person.jobTitle(),
        };
      })
      .get("image", ({ query }) => {
        const width = parseInt(query.width as string, 10) || 100;
        const height = parseInt(query.height as string, 10) || 100;
        const format = (query.format as ImageFormat) || "png";
        const bg_color = (query.bgColor as string) || "#000000";
        const source = (query.source as ImageSource) || ImageSource.placeholder;
        const grayscale = query.grayscale === "true";

        if (source === ImageSource.picsum) {
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
      })
  );

app.listen("3000");

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
