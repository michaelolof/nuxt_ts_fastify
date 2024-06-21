import { type TObject, type Static, type TSchema, Type, type TProperties } from "@sinclair/typebox";
import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";

export type BaseSchema = {
    query?: TObject<any>;
    body?: TObject<any>;
    params?: TObject<any>;
    headers?: TObject<any>;
    response?: Record<number | string, TSchema>;
};

export type DefinedSchema<Q extends TProperties, B extends TProperties, P extends TProperties, H extends TProperties> = {
    query?: TObject<Q>;
    body?: TObject<B>;
    params?: TObject<P>;
    headers?: TObject<H>;
    response?: Record<number | string, TSchema>;
};

export const defineSchema = <S extends BaseSchema>(schema: S) => schema;

type InformationalStatuses = 100 | 102 | 103;
type SuccessStatuses = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;
type RedirectionStatuses = 300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;
type ClientErrorStatuses = 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 431 | 451;
type ServerErrorStatuses = 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 510 | 511;

type InferDefaultResponse<U> = U extends Record<"default", TSchema> ? Static<U["default"]> : never;

type InferResponseByCode<C extends string | number, T> = T extends BaseSchema
    ? T["response"] extends (infer U) | undefined
    ? U extends Record<C, TSchema>
    ? Static<U[C]>
    : U extends Record<number | string, TSchema>
    ? C extends InformationalStatuses
    ? U extends Record<"1XX", TSchema>
    ? Static<U["1XX"]>
    : InferDefaultResponse<U>
    : C extends SuccessStatuses
    ? U extends Record<"2XX", TSchema>
    ? Static<U["2XX"]>
    : InferDefaultResponse<U>
    : C extends RedirectionStatuses
    ? U extends Record<"3XX", TSchema>
    ? Static<U["3XX"]>
    : InferDefaultResponse<U>
    : C extends ClientErrorStatuses
    ? U extends Record<"4XX", TSchema>
    ? Static<U["4XX"]>
    : InferDefaultResponse<U>
    : C extends ServerErrorStatuses
    ? U extends Record<"5XX", TSchema>
    ? Static<U["5XX"]>
    : InferDefaultResponse<U>
    : never
    : never
    : never
    : never;

type ReplyUtils<S> = {
    sendJSON<C extends number>(code: C, payload: InferResponseByCode<C, S>): any;
};

//@ts-expect-error I know what I'm doing here
type FastifyRequestSchemaPayload<S> = FastifyRequest<{ Body: Static<S["body"]>; Headers: Static<S["headers"]>; Params: Static<S["params"]>; Reply: Static<S["response"][200]>; Querystring: Static<S["query"]> }>;

//@ts-expect-error I know what i'm doing here
type FastifyReplySchemaPayload<S> = FastifyReply<any, any, any, { Body: Static<S["body"]>; Headers: Static<S["headers"]>; Params: Static<S["params"]>; Reply: Static<S["response"][200]>; Querystring: Static<S["query"]> }> & ReplyUtils<S>;


type BaseController<S extends BaseSchema, D extends TSchema> = {
    locals?: D;
    schema?: S;
    preHandler?: ((req: FastifyRequestSchemaPayload<S> & { locals: Static<D> }, resp: FastifyReplySchemaPayload<S>, next: () => void) => void)[];
    //@ts-expect-error I know what i'm doing here
    handler: (req: FastifyRequestSchemaPayload<S> & { locals: Static<D> }, rep: FastifyReplySchemaPayload<S>) => Promise<Static<S["response"][200]>>;
};

type PredefinedController<S extends BaseSchema, S0 extends BaseSchema, D extends TSchema, D0 extends TSchema> = {
    locals?: D;
    schema?: S;
    preHandler?: ((req: FastifyRequestSchemaPayload<S>, resp: FastifyReplySchemaPayload<S>, next: () => void) => void)[];
    //@ts-expect-error I know what i'm doing here
    handler: (req: FastifyRequestSchemaPayload<S & S0> & { locals: Static<D> & Static<D0> }, rep: FastifyReplySchemaPayload<S & S0>) => Promise<Static<S["response"][200]>>;
};

type UnknownController = {
    schema?: any;
    handler: any;
    preHandler?: ((req: any, resp: any, next: () => void) => void)[];
};

export const useControllerDefinition = <S extends BaseSchema, D extends TSchema>(definition: Omit<BaseController<S, D>, "handler">) => <S1 extends BaseSchema, D1 extends TSchema>(options: PredefinedController<S1, S, D1, D>): UnknownController => {

    const merge = (one: TSchema | undefined, two: TSchema | undefined) => {
        if (!one && !two) {
            return undefined;
        } else if (one && !two) {
            return one;
        } else if (two && !one) {
            return two;
        }
        return Type.Composite([one!, two!]);
    };

    const trimFields = <T extends Record<string, any>>(obj: T) => {
        for (const key in obj) {
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

type ControllerOptions<S> = {
    schema?: S;
    //@ts-expect-error I know what i'm doing here
    handler: (req: FastifyRequestSchemaPayload<S>, res: FastifyReplySchemaPayload<S>) => Promise<Static<S["response"][200]>>;
    preHandler?: ((req: FastifyRequestSchemaPayload<S>, res: FastifyReplySchemaPayload<S>, next: () => void) => void)[];
};

export function defineController<S>(options: ControllerOptions<S>): ControllerOptions<S> {
    return options;
}

const methods = [
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
] as const;

export type FastifyRouter = Record<typeof methods[number], (url: string, controller: UnknownController) => any>;

export function defineRouter(app: FastifyInstance): FastifyRouter {

    const rtn = {} as FastifyRouter;

    for (const m of methods) {
        rtn[m] = (url, controller) => {
            return app.route({ url, method: m, handler: controller.handler, schema: controller.schema, preHandler: controller.preHandler });
        };
    }

    return rtn;
}

export function initRouter(app: FastifyInstance) {
    app.decorateReply("sendJSON", function (this: FastifyReply, code: number, res: any) {
        return this.code(code)
            .headers({ "content-type": "application/json; charset=utf-8" })
            .send(res);
    });
    app.decorateRequest("locals", null);
    app.addHook("preHandler", (req, res, next) => {
        //@ts-expect-error We're attaching an error object to req.locals
        req.locals = {};
        next();
    });
}