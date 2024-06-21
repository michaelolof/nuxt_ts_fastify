import { setupDBConnection } from "#server/modules/setup/postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const db = drizzle(setupDBConnection("migrations"));

async function runMigrations() {
    console.log("Starting running migrations...");
    await migrate(db, { migrationsFolder: "./server/db/gen/drizzle" });
    console.log("Starting running migrations...");
}

runMigrations()
    .then(() => {
        console.log("Exiting process");
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });