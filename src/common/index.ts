import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "../drizzle/schema";

export type Database = BetterSQLite3Database<typeof schema>;
