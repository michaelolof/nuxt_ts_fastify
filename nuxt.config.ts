// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    serverHandlers: [
        {
            route: "/api",
            middleware: true,
            handler: "./server/index.ts",
        },
    ],
});