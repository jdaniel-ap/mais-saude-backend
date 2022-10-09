import { PrismaClient } from '@prisma/client'
import { Course } from '../interface/course'

class CourseModel {
  private prisma : PrismaClient;

  public constructor () {
    this.prisma = new PrismaClient()
  }

  public async store (data : Course): Promise<Course> {
    const request = await this.prisma.courses.create({
      data
    })

    return request
  }
}

export default new CourseModel()
