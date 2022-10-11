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
    const invalidParameters : string[] = []
    const missingValues : string[] = []

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

  private async checkAvailability (name : string) : Promise<void> {
    const result = await this.prisma.courses.findFirst(
      { where: {
        name: name.toLowerCase()
      } })

    if (result) throw new Error('A course with this name already exist')
  }

  public async checkCourse (payload : Course) : Promise<void> {
    await this.checkValues(payload)
    await this.checkAvailability(payload.name)
  }

  // public async checkParameters (payload : object) : Promise<Course[]> {

  // }
}

export default new CourseService()
