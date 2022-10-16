import { z } from 'zod'

export const addressSchema = z.object({
  address: z.string(),
  cep: z.string().min(7, 'CEP must have at least 7 characters'),
  city: z.string(),
  complement: z.string().optional(),
  state: z.string().min(2, 'Invalid State format').max(2, 'Invalid state format')
})

export const informationSchema = z.object({
  cpf: z.preprocess((arg) => {
    if (Number(arg)) return arg
    return false
  // eslint-disable-next-line @typescript-eslint/camelcase
  }, z.string({ invalid_type_error: 'Invalid cpf number format' })),
  email: z.string().email({ message: 'Must be a valid email' }),
  phone: z.preprocess((arg) => {
    if (Number(arg)) return arg
    return false
  // eslint-disable-next-line @typescript-eslint/camelcase
  }, z.string({ invalid_type_error: 'Invalid phone number format' }))
})

export const authSchema = z.object({
  password: z.string().min(6, 'Password must be 6 or more characters long')
    .max(12, 'Must be 5 or more characters long')
})

export const createSchema = z.object({
  role: z.enum(['PROFESSIONAL', 'PATIENT']),
  fullname: z.string().min(6, 'Name must be at least 6 characters'),
  gender: z.enum(['MASCULINE', 'FEMENINE', 'OTHERS']),
  birth: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
    return false
  }, z.date()),
  photoURL: z.string().nullable().optional(),
  conditions: z.boolean(),
  informations: informationSchema,
  address: addressSchema,
  auth: authSchema
})
