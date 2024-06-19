import { setupServer } from "#server/modules/setup/fastify";

const port = Number(process.env.PORT);

const app = setupServer(port, {
    logger: process.env.NODE_ENV === "development" ? { transport: { target: "pino-pretty" } } : true,
});

app.get("/ping", () => {
    return {
        status: "success",
        message: "Server is active",
        data: null,
    };
});

export default eventHandler(async(event) => {
    await app.ready();
    app.server.emit("request", event.node.req, event.node.res);
});