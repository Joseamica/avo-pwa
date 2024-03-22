import { z } from 'zod'
export const venueSchema = z.object({
  name: z.string().min(3, { message: 'Password is too short..' }),
  image: z.string().url('Debe ser una URL válida').min(1, 'La imagen es requerida'),
  logo: z.string().url('Debe ser una URL válida').min(1, 'El logo es requerido'),
  tip_one: z.string().min(1, 'El tip 1 es requerido'),
  tip_two: z.string().min(1, 'El tip 2 es requerido'),
  tip_three: z.string().min(1, 'El tip 3 es requerido'),
  pos: z.string().min(1, 'El sistema POS es requerido'),
  stripe: z.string().min(1, 'El ID de cuenta Stripe es requerido'),
})
