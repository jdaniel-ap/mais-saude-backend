import { PrismaClient } from '@prisma/client'
import { SafeParseReturnType } from 'zod'

import { UserInformations, UserResponse } from '../interface/users'
import UserModel from '../model/userModel'
import { messages, status } from '../utils/httpResponses'
import { createSchema } from '../utils/zodSchemas'

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
    const finder = await this.prisma.informations.findMany({
      where: { OR:
        [{ email: payload.informations.email },
          { phone: payload.informations.phone },
          { cpf: payload.informations.cpf }
        ]
      }
    })

    if (finder.length) {
      let existence : object = {}
      const tableEntries = Object.keys(finder[0])
      for (const index in finder) {
        for (const key of tableEntries) {
          if (finder[index][key] === payload.informations[key] && key !== 'id') {
            existence[key] = `The ${key} provided is already registered`
          }
        }
      }
      return existence
    }

    return null
  }

  private checkBodyRequest (payload : UserInformations) : SafeParseReturnType<object, UserInformations> {
    const result = createSchema.safeParse(payload)

    return result
  }

  public async execute (payload : UserInformations) : Promise<UserResponse> {
    try {
      const checkBody = this.checkBodyRequest(payload)
      if (!checkBody.success) {
        return this.objResponse(status.FAILED, VALIDATION_ERROR, checkBody.error.issues)
      }

      const finder = await this.checkCoincidense(payload)
      if (finder) return this.objResponse(FAILED, VALIDATION_ERROR, finder)

      const createReq = await UserModel.store(checkBody.data)
      return this.objResponse(CREATED, OK, createReq)
    } catch (err) {
      return this.objResponse(FAILED, OK, err)
    }
  }
}

export default new UserService()
