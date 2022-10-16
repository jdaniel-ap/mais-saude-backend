import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

import { User, UserInformations } from '../interface/users'

class UserModel {
  private prisma : PrismaClient

  public constructor () {
    this.prisma = new PrismaClient()
  }

  public async store (data : UserInformations) : Promise<User | object> {
    const { informations, address, auth, ...rest } = data
    auth.password = await hash(auth.password, 10)
    const createReq = await this.prisma.users.create({
      data: { ...rest,
        informations: {
          create: {
            ...informations
          }
        },
        auth: {
          create: {
            ...auth
          }
        },
        address: {
          create: {
            ...address
          }
        }
      },
      select: {
        id: true,
        birth: true,
        fullname: true,
        gender: true,
        photoURL: true,
        role: true
      }
    }
    )

    return createReq
  }
}

export default new UserModel()
