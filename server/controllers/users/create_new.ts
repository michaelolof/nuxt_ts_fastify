import { errs } from "#server/modules/errors/keys";
import { Type } from "@sinclair/typebox";
import { AppError } from "#server/modules/errors/types";
import { defineController, defineSchema } from "#server/vendor/fastify_helpers/index";
import { UserDto } from "#utils/dtos/index";


export const createNewUser = defineController({
    schema: defineSchema({
        body: Type.Omit(UserDto, ["id"]),
        response: {
            201: UserDto, 
        },
    }),

    async handler(req, res) {
        // Only allow users above 18 to signup
        if (req.body.age < 18) {
            throw new AppError(errs.BadRequest, "User must be above 18 to signup");
        }

        return res.sendCode(201, {
            id: "10",
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            age: req.body.age,
            phone: req.body.phone,
        });
    },
});