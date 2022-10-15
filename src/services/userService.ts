import { PrismaClient } from '@prisma/client'
import { z, ZodIssue } from 'zod'

import { UserInformations, UserResponse } from '../interface/users'
import UserModel from '../model/userModel'
import { messages, status } from '../utils/httpResponses'

const { VALIDATION_ERROR, OK } = messages
const { FAILED, CREATED } = status

class UserService {
  private prisma : PrismaClient;

  public constructor () {
    this.prisma = new PrismaClient()
  }

  private objResponse (status : string, message : string, data : object) : UserResponse {
    return { status, message, data }
  }

  private async checkCoincidense (payload : UserInformations) : Promise<object | null> {
    const finder = await this.prisma.informations.findFirst({
      where: { OR:
        [{ email: payload.informations.email },
          { phone: payload.informations.phone },
          { cpf: payload.informations.cpf }
        ]
      }
    })

    if (finder) {
      let existence : object = {}
      const tableEntries = Object.keys(finder)
      for (const key of tableEntries) {
        if (finder[key] === payload.informations[key] && key !== 'id') {
          existence[key] = `The ${key} provided is already registered`
        }
      }
      return existence
    }

    return null
  }

  private checkBodyRequest (payload : UserInformations) : ZodIssue[] | null {
    const informationSchema = z.object({
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

    const addressSchema = z.object({
      address: z.string(),
      cep: z.string().min(7, 'CEP must have at least 7 characters'),
      city: z.string(),
      complement: z.string().nullable().optional(),
      state: z.string().min(2, 'Invalid State format').max(2, 'Invalid state format')
    })

    const schema = z.object({
      role: z.enum(['PROFESSIONAL', 'PATIENT']),
      fullname: z.string().min(6, 'Name must be at least 6 characters'),
      gender: z.enum(['MASCULINE', 'FEMENINE', 'OTHERS']),
      birth: z.preprocess((arg) => {
        if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
      }, z.date()),
      photoURL: z.string().nullable().optional(),
      conditions: z.boolean(),
      informations: informationSchema,
      address: addressSchema
    })

    const result = schema.safeParse(payload)

    if (!result.success) {
      return result.error.issues
    }

    return null
  }

  public async execute (payload : UserInformations) : Promise<UserResponse> {
    try {
      const checkBody = this.checkBodyRequest(payload)
      if (checkBody) {
        return this.objResponse(status.FAILED, VALIDATION_ERROR, checkBody)
      }

      const finder = await this.checkCoincidense(payload)
      if (finder) return this.objResponse(FAILED, VALIDATION_ERROR, finder)

      const createReq = await UserModel.store(payload)
      return this.objResponse(CREATED, OK, createReq)
    } catch (err) {
      return this.objResponse(FAILED, OK, err)
    }
  }
}

export default new UserService()
