import { type FastifyPluginAsync } from "fastify";
import { createNewUser } from "#server/controllers/users/create_new";
import { defineRouter } from "#server/vendor/fastify_helpers/index";

const v1Routes: FastifyPluginAsync = async(app) => {
    const router = defineRouter(app);

    router.post("/users/new_user", createNewUser);
};

export default v1Routes;