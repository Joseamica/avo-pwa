import { z } from 'zod'

export const IncognitoUser = z.object({
  // name: z.string().min(3, "That's not a real name"),
  color: z.string().min(3, "That's not a real color").default('##2e8857'),
  createdAt: z.number().default(Date.now()).optional(),
  stripeCustomerId: z.string().optional(),
  tableNumber: z.number().optional(),
})

export type IncognitoUser = z.infer<typeof IncognitoUser>
