import { z } from 'zod';
import { BLOOD_GROUP, COUNTRY_LIST, GENDER, USER_ROLE } from './user.constant';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.object({
      firstName: z.string({ required_error: 'First name is required' }),
      lastName: z.string({ required_error: 'Last name is required' }),
    }),
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z
      .string({ required_error: 'Password is required' })
     .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
    country: z.enum([...COUNTRY_LIST] as [string, ...string[]], {
      required_error: 'Country is required',
    }),
    gender: z.enum(
      Object.values(GENDER) as [string, ...string[]],
      { required_error: 'Gender is required' },
    ),
    bloodGroup: z
      .enum(
        Object.values(BLOOD_GROUP) as [string, ...string[]],
      )
      .optional(),
    designation: z.string().optional(),
    role: z
      .enum(
        Object.values(USER_ROLE) as [string, ...string[]],
      )
      .optional(),
    socialMedia: z
      .array(z.object({ name: z.string(), link: z.string() }))
      .optional(),
    profileImg: z.string().optional(),
    passwordChangedAt: z.date().optional(),
    status: z.enum(['active', 'blocked'] as [string, string]).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  // ...other validations if needed
};
