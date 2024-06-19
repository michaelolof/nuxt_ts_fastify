import { Type } from "@sinclair/typebox";

export const defineSchema = (schema) => schema;

export const useControllerDefinition = (definition) => (options) =>  {
    
    const merge = (one, two) => {
        if (!one && !two) {
            return undefined;
        } else if (one && !two) {
            return one;
        } else if (two && !one) {
            return two;
        }
        return Type.Composite([one, two]);
    };

    const trimFields = (obj) => {
        for(const key in obj) {
            if (obj[key] === undefined) {
                delete obj[key];
            }
        }
        return obj;
    };

    const schema = trimFields({
        query: merge(definition.schema?.query, options.schema?.query),
        headers: merge(definition.schema?.headers, options.schema?.headers),
        body: merge(definition.schema?.body, options.schema?.body),
        params: merge(definition.schema?.params, options.schema?.params),
        response: { ...definition.schema?.response || {}, ...options.schema?.response },
        locals: merge(definition.locals, options.locals),
    });

    const preHandlers = [...definition.preHandler || [], ...options.preHandler || []];

    return {
        schema,
        preHandler: preHandlers.length > 0 ? preHandlers : undefined,
        handler: options.handler,
    };
    
};
    
export function defineController(options) {
    return options;
}

/**
 * @param {import("fastify").FastifyInstance} app 
 */
export function defineRouter(app) {

    const methods = /** @type {const}*/ ([
        "delete",
        "get",
        "head",
        "patch",
        "post",
        "put",
        "options",
        "propfind",
        "proppatch",
        "mkcol",
        "copy",
        "move",
        "lock",
        "unlock",
        "trace",
        "search",
    ]);

    const rtn = {};

    for(const m of methods) {
        rtn[m] = (url, controller) => {
            return app.route({ url, method: m, handler: controller.handler, schema: controller.schema, preHandler: controller.preHandler });
        };
    }

    return rtn;
}

/**
 * @param {import("fastify").FastifyInstance} app 
 */
export function initRouter(app) {
    app.decorateReply("sendCode", function(code, res) {
        return this.code(code).send(res);
    });
    app.decorateRequest("locals", null);
    app.addHook("preHandler", (req, res, next) => {
        req.locals = {};
        next();
    });
}