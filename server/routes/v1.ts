import { createNewUser } from "#server/controllers/users/create_new";
import { defineRouter } from "#server/vendor/fastify_helpers/index";
import { type FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const v1Routes: FastifyPluginAsyncTypebox = async(app) => {
    const router = defineRouter(app);

    router.post("/users/new_user", createNewUser);

};

export default v1Routes;