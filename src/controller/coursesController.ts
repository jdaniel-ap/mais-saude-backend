import { Request, Response } from 'express'
import CourseModel from '../model/courseModel'
import CourseService from '../services/courseServices'
import { httpStatus } from '../utils/httpstatus'

class CourseController {
  public async list (req: Request, res: Response): Promise<Response | undefined> {
    const { query } = req
    const list = await CourseModel.list(query)
    return res.json({ data: list })
  }

  public async store (req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { body } = req

      await CourseService.checkCourse(body, true)

      const insertCourse = await CourseModel.store(body)

      return res.status(httpStatus.CREATED).json({ ...insertCourse })
    } catch (err) {
      res.status(httpStatus.BAD_REQUEST).json({ message: err.message })
    }
  }

  public async update (req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { id } = req.params
      const { body } = req
      await CourseService.checkCourse({ id, ...body }, false)

      const updateCourse = await CourseModel.update({ id, ...body })

      return res.json(updateCourse)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }
}

export default new CourseController()
