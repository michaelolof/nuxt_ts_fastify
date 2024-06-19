import path from "path";
import { fileURLToPath } from "url";
import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import autolad from "@fastify/autoload";
import { type ErrorResponse, parseAppError } from "#server/modules/errors/utils";
import { initRouter } from "../../vendor/fastify_helpers/index.mjs";
import { errs } from "#server/modules/errors/keys";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __srcdir = path.resolve(__dirname, "../../");


export function setupServer<T extends FastifyServerOptions>(port: number, opts: T): FastifyInstance {
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
                { url: `http://localhost:${port}`, description: "Local development server" },
            ],
        },
    });

    app.register(fastifySwaggerUi, {
        routePrefix: "/api-docs",
    });

    app.register(autolad, {
        dir: `${__srcdir}/server/routes`,
    });

    app.setErrorHandler((err, req, res) => {
        const aerr = parseAppError(err);  
        return res.code(aerr.statusCode)
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
            .send({
                status: "error",
                key: errs.NotFound.key,
                message: "Resource not found",
                data: null,
            } satisfies ErrorResponse);
    });

    return app;
}