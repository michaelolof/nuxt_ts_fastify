import { getServerEnv } from "#server/modules/config/env";
import postgres from "postgres";

type DBConnectionContext = "migrations" | "test" | "db";

export function setupDBConnection(context: DBConnectionContext) {
    const max = context === "migrations" ? 1 : undefined;
    
    const conn = postgres({
        user: getServerEnv("POSTGRES_USER"),
        password: getServerEnv("POSTGRES_PASSWORD"),
        host: getServerEnv("POSTGRES_HOST"),
        port: getServerEnv("POSTGRES_PORT"),
        database: getServerEnv("POSTGRES_DB"),
        max,
    });

    return conn;
}