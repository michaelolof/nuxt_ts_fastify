import path from "path";
import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import { type ErrorResponse, parseAppError } from "#server/modules/errors/utils";
import { initRouter } from "../../vendor/fastify_helpers/index";
import { errs } from "#server/modules/errors/keys";
import v1Routes from "#server/routes/v1";



export function setupServer<T extends FastifyServerOptions>(opts?: T): FastifyInstance {
    const app = Fastify(opts).withTypeProvider();

    initRouter(app);

    app.register(cors, {});
    
    app.register(fastifySwagger, {
        openapi: {
            openapi: "3.1.0",
            info: {
                title: "Flowborg API",
                description: "Flowborg User API Documentation",
                version: "1.0.0",
            },
            servers: [
                { url: `http://localhost/api`, description: "Local development server" },
            ],
        },
        
    });

    serverApiDocs(app, "/api-docs");
    
    app.register(v1Routes, { prefix: "v1" });

    app.setErrorHandler((err, req, res) => {
        const aerr = parseAppError(err);
        return res.code(aerr.statusCode)
            .headers({"content-type": "application/json; charset=utf-8"})
            .send({
                status: "error",
                key: aerr.key,
                ts: aerr.ts,
                message: aerr.message,
                data: aerr.data || null,
            } satisfies ErrorResponse);            

    });

    app.setNotFoundHandler((req, res) => {
        return res.code(404)
            .headers({"content-type": "application/json; charset=utf-8"})
            .send({
                status: "error",
                key: errs.NotFound.key,
                message: "Resource not found",
                data: null,
            } satisfies ErrorResponse);
    });

    return app;
}


function serverApiDocs(app: FastifyInstance, routeUrl: string) {
    const jsonPath = path.join(routeUrl, "/q/json"); 

    app.get(jsonPath, (_, res) => {
        const swg = app.swagger({ yaml: false });
        return res.send(swg);
    });

    app.get(routeUrl, (req, res) => {
        return res.type("text/html").send(stopLightDocs(path.join("/api", jsonPath)));
    });

}

function stopLightDocs(path: string): string {
    return `
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <title>Elements in HTML</title>
            <!-- Embed elements Elements via Web Component -->
            <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
            <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
        </head>
        <body>

            <elements-api
                apiDescriptionUrl="${path}"
                router="hash"
                layout="sidebar"
            />
        </body>
        </html>
    `;
}