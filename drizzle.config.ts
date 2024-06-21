import dotenv from "dotenv";
import { getServerEnv } from "./server/modules/config/env";
import { defineConfig } from "drizzle-kit";

dotenv.config();


export default defineConfig({
    schema: "./server/db/schema.ts",
    dialect: "postgresql",
    out: "./server/db/gen/drizzle",
    dbCredentials: {
        user: getServerEnv("POSTGRES_USER"),
        password: getServerEnv("POSTGRES_PASSWORD"),
        host: getServerEnv("POSTGRES_HOST"),
        port: getServerEnv("POSTGRES_PORT"),
        database: getServerEnv("POSTGRES_DB"),
    },
    verbose: true,
    strict: true,
});