import { PrismaClient } from '@prisma/client'
import { Course } from '../interface/course'

class CourseService {
  private prisma: PrismaClient

  public constructor () {
    this.prisma = new PrismaClient()
  }

  private async checkValues (course : Course) : Promise<void> {
    const courseParameters = ['name', 'description', 'duration']
    const courseValues = Object.entries(course)
    const missingValues : string[] = []
    const invalidParameters : string[] = []

    for (const [key, value] of courseValues) {
      if (key === 'duration' && !value) invalidParameters.push(key)
      if (key !== 'duration' && !value.length) invalidParameters.push(key)
    }

    if (invalidParameters.length) throw new Error(`invalid the following parameters: ${invalidParameters.join(', ')}`)

    for (const key of courseParameters) {
      if (!(key in course)) {
        missingValues.push(key)
      }
    }

    if (missingValues.length) throw new Error(`missing the following values: ${missingValues.join(', ')}`)
  }

  public async checkCourse (payload : Course) : Promise<Course | null> {
    await this.checkValues(payload)

    const result = await this.prisma.courses.findFirst(
      { where: {
        name: payload.name
      } })

    return result
  }
}

export default new CourseService()
