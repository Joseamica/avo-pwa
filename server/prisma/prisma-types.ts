// prisma-types.ts
import { Bill as PrismaBill, Payment as PrismaPayment } from '@prisma/client'

export type Payment = PrismaPayment

export type Bill = PrismaBill & {
  payments: Payment[]
}
