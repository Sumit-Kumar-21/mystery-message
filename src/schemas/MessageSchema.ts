import { z } from 'zod';

export const MessageSchema = z.object({
    content: z.string({invalid_type_error: 'username should be string'})
    .min(10, 'Message must be contain at-least 10 character')
    .max(300, 'Message must be contain maximum 300 character')
})