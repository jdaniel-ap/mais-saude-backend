import { PrismaClient } from '@prisma/client'
import { User, UserInformations } from '../interface/users'

class UserModel {
  private prisma : PrismaClient

  public constructor () {
    this.prisma = new PrismaClient()
  }

  public async store (data : UserInformations) : Promise<User | object> {
    const { informations, address, ...rest } = data
    const createReq = await this.prisma.users.create({
      data: { ...rest,
        informations: {
          create: {
            ...informations
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
