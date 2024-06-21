// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    nitro: {
        esbuild: {
            options: {
                target: "esnext",
            },
        },
    },
    runtimeConfig: {
        FASTIFY_AUTOLOAD_TYPESCRIPT: process.env.FASTIFY_AUTOLOAD_TYPESCRIPT || "1",
    },
    modules: [
        "@nuxt/test-utils/module",
    ],
    serverHandlers: [
        {
            route: "/api",
            middleware: true,
            handler: "./server/index.ts",
        },
    ],
});