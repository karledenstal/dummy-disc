import { Elysia } from "elysia";
import { ID_TYPES, user_schema, users_schema } from "./types";
import { generateUser } from "./func";
import { db } from "../db/db";
import { users_table } from "../db/schema";
import { count } from "drizzle-orm";

export const user_route = new Elysia({ prefix: "/users" })
  .get(
    "/",
    async ({ query }) => {
      const limit = query.limit || 10;
      const page = query.page || 1;
      const offset = (page - 1) * limit;
      const id_type = query.id_type || ID_TYPES.plain;

      const total_count = await db.select({ value: count() }).from(users_table);
      const items = await db
        .select()
        .from(users_table)
        .limit(limit)
        .offset(offset);
      const total_pages = Math.ceil(total_count[0].value / limit);

      return {
        limit,
        page,
        totalPages: total_pages,
        users: items.map(({ uuid, id, objectid, ...rest }) => {
          let overwrite_id: string | number = id;

          if (id_type === ID_TYPES.uuid) {
            overwrite_id = uuid as string;
          } else if (id_type === ID_TYPES.objectid) {
            overwrite_id = objectid as string;
          }

          return { id: overwrite_id, ...rest };
        }),
      };
    },
    users_schema
  )
  .get(
    "/:id",
    ({ params: { id } }) => {
      return generateUser(id);
    },
    user_schema
  );
