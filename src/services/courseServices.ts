import { PrismaClient } from '@prisma/client'
import { Course, CourseId } from '../interface/course'

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

  private async checkAvailability (data : CourseId) : Promise<Course | null> {
    const payload = data.id ? { id: data.id } : { name: data.name.toLocaleLowerCase() }
    console.log(data)
    const result = await this.prisma.courses.findUnique(
      {
        where: {
          ...payload
        }
      })

    return result
  }

  public async checkCourse (payload : CourseId, checkValues : boolean) : Promise<void> {
    checkValues && await this.checkValues(payload)
    const availability = await this.checkAvailability(payload)
    if (checkValues && availability) throw new Error('A course with this name already exist')

    if (!availability) throw new Error('This user doesn\'nt exist')
  }
}

export default new CourseService()
