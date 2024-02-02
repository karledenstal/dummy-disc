import { Elysia } from "elysia";
import { ID_TYPES, user_schema, users_schema } from "./types";
import { db } from "../db/db";
import { users_table } from "../db/schema";
import { count } from "drizzle-orm";

function identifyIdType(
  id: string | number
): "id" | "uuid" | "objectid" | undefined {
  // Check if it's a number type
  if (typeof id === "number" || !isNaN(Number(id))) {
    return "id";
  }

  // MongoDB ObjectId is a 24-character hex string
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (objectIdRegex.test(id)) {
    return "objectid";
  }

  // UUID v4 regex (you can adjust the regex if you want to be more specific about the UUID version)
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidV4Regex.test(id)) {
    return "uuid";
  }
}

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
    async ({ params: { id } }) => {
      try {
        const typeOfId = identifyIdType(id);
        let val: string | number = id;

        if (typeOfId == null) {
          throw new Error("Invalid ID");
        }

        if (typeOfId === "id") {
          val = id as number;
        } else if (typeOfId === "uuid") {
          val = id.toString();
        } else if (typeOfId === "objectid") {
          val = id.toString();
        }

        const users = await db.select().from(users_table);
        const user = users.find(
          (u) =>
            u.id === +id ||
            u.uuid === id.toString() ||
            u.objectid === id.toString()
        );

        console.log('user', user)

        if (user == null) {
          throw new Error("User not found");
        }

        const { id: orgId, uuid, objectid, ...rest } = user;

        return { id: val, ...rest };
      } catch (e) {
        console.error(e);
      }
    },
    user_schema
  );
