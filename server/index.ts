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

try {
    await app.ready();
} catch(e) {
    console.log("Error getting ready", e);
}

export default eventHandler(async(event) => {
    app.server.emit("request", event.node.req, event.node.res);
});

// export default lazyEventHandler(async() => {    

//     await app.ready();

//     return eventHandler(async(event) => {
//         app.server.emit("request", event.node.req, event.node.res);
//     });
// });