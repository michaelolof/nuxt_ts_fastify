import { Type } from "@sinclair/typebox";

export const UserDto = Type.Object({
    id: Type.String(),
    first_name: Type.String(),
    last_name: Type.String(),
    email: Type.String(),
    age: Type.Integer(),
    phone: Type.Optional(Type.String()),
});