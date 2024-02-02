import { blob, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export type UserAddress = {
  street: string;
  city: string;
  zipCode: string;
  geo: {
    lat: number;
    lng: number;
  };
};

export const users_table = sqliteTable("users", {
  id: integer("id").notNull().primaryKey(),
  uuid: text("uuid"),
  objectid: text("objectid"),
  name: text("name"),
  username: text("username"),
  email: text("email"),
  phoneNumber: text("phoneNumber"),
  address: text("address", { mode: "json" }),
  company: text("company"),
  jobTitle: text("jobTitle"),
});
