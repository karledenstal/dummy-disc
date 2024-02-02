import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { db } from "./src/db/db";

migrate(db, { migrationsFolder: "./drizzle" });

console.log('Migrations ran successfully!')