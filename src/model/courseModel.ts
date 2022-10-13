import { PrismaClient } from '@prisma/client'
import { Course, CourseId } from '../interface/course'
import { Queries } from '../interface/queries'

class CourseModel {
  private prisma : PrismaClient;

  public constructor () {
    this.prisma = new PrismaClient()
  }

  private queryCleaner (queries : Queries) : Queries {
    const availableQueries = ['id', 'name', 'duration']
    let queriesContainer = queries

    for (const key of Object.keys(queriesContainer)) {
      if (!availableQueries.includes(key)) {
        delete queriesContainer[key]
      } else {
        queriesContainer[key] = {
          [Number(queries[key]) ? 'equals' : 'contains']: Number(queries[key]) || queries[key]
        }
      }
    }
    console.log(queriesContainer)
    return queriesContainer
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

  public async list (data : Queries) : Promise<Course[]> {
    const cleaner = this.queryCleaner(data)

    return this.prisma.courses.findMany({
      where: {
        ...cleaner
      }
    })
  }

  public async update (data : CourseId) : Promise <Course> {
    const request = await this.prisma.courses.update({
      where: {
        id: data.id
      },
      data
    })

    return request
  }
}

export default new CourseModel()
