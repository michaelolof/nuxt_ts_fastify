import dotenv from "dotenv";

type ServerEnvVars = {
    HOST: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: number;
    POSTGRES_DB: string;
};

let envIsLoaded = false;

export function getServerEnv<T extends keyof ServerEnvVars>(key: T): ServerEnvVars[T] {
    if (!envIsLoaded) {
        dotenv.config();
        envIsLoaded = true;
    }

    const val = process.env[key];
    switch (key) {
        case "POSTGRES_PORT":
            return Number(val) as any;
        default:
            return val as any;
    }
}