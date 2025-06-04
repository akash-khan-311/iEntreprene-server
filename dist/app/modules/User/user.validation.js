"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.object({
            firstName: zod_1.z.string({ required_error: 'First name is required' }),
            lastName: zod_1.z.string({ required_error: 'Last name is required' }),
        }),
        email: zod_1.z.string({ required_error: 'Email is required' }).email(),
        password: zod_1.z
            .string({ required_error: 'Password is required' })
            .min(6, 'Password must be at least 6 characters')
            .max(20, 'Password must not exceed 20 characters'),
        country: zod_1.z.enum([...user_constant_1.COUNTRY_LIST], {
            required_error: 'Country is required',
        }),
        gender: zod_1.z.enum(Object.values(user_constant_1.GENDER), { required_error: 'Gender is required' }),
        bloodGroup: zod_1.z
            .enum(Object.values(user_constant_1.BLOOD_GROUP))
            .optional(),
        designation: zod_1.z.string().optional(),
        role: zod_1.z
            .enum(Object.values(user_constant_1.USER_ROLE))
            .optional(),
        socialMedia: zod_1.z
            .array(zod_1.z.object({ name: zod_1.z.string(), link: zod_1.z.string() }))
            .optional(),
        profileImg: zod_1.z.string().optional(),
        passwordChangedAt: zod_1.z.date().optional(),
        status: zod_1.z.enum(['active', 'blocked']).optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
exports.UserValidation = {
    createUserValidationSchema,
    // ...other validations if needed
};
