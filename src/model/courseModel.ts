import { PrismaClient } from '@prisma/client'
import { Course } from '../interface/course'

class CourseModel {
  private prisma : PrismaClient;

  public constructor () {
    this.prisma = new PrismaClient()
  }

  private formatData (data: Course) : Course {
    const objEntries = Object.entries(data)
    let formatValues = data

    for (const [key, value] of objEntries) {
      formatValues = { ...formatValues,
        [key]: typeof value === 'string'
          ? value.toLowerCase() : value }
    }
    return formatValues
  }

  public async store (data : Course): Promise<Course> {
    const formatData = this.formatData(data)
    const request = await this.prisma.courses.create({
      data: formatData
    })

    return request
  }
}

export default new CourseModel()
