import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { setupServer } from "#server/modules/setup/fastify";

const url = "/v1/users/new_user";
const app = setupServer();

describe("POST createNewUsers", () => {

    beforeAll(async() => {
        await app.ready();
    });

    afterAll(async() => {
        await app.close();
    });

    it("Should fail with 400 Bad Request for users less than 18 years", async() => {
        const res = await app.inject({
            method: "POST",
            url,
            body: {
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@mail.com",
                age: 14,
            },
        });

        const actual = res.json();
        const expected = {
            status: "error",
            key: "BAD_REQUEST_ERROR",
            message: "User must be above 18 to signup",
            data: null,
        };

        expect(res.statusCode).toBe(400);
        expect(actual).toMatchObject(expected);
    });

    it("Should succeed with 201 status for users above or equal to 18 years", async() => {
        const res = await app.inject({
            method: "POST",
            url,
            body: {
                first_name: "John",
                last_name: "Doe",
                email: "johndoe@mail.com",
                age: 24,
            },
        });

        expect(res.statusCode).toBe(201);
    });

});