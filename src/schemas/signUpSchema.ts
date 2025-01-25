import { z } from 'zod';

export const usernameValidation = z
    .string({invalid_type_error: 'username should be string'})
    .min(2, 'username must be contain at-least 2 character')
    .max(20, 'username must be contain maximum 20 character')
    .regex(/^[a-zA-Z)-9_]+$/, {message: 'username must not contain special character'});

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: 'Password must be contain at-least 6 character'})
})