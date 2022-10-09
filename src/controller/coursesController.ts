import { Request, Response } from 'express'
import CourseModel from '../model/courseModel'
import CourseService from '../services/courseServices'

class CourseController {
  public async list (req: Request, res: Response): Promise<Response | undefined> {
    return res.json({ message: '' })
  }

  public async store (req: Request, res: Response): Promise<Response | undefined> {
    try {
      const { body } = req

      const checkAvailaibity = await CourseService.checkCourse(body)

      if (checkAvailaibity) {
        return res.status(400).json({ message: 'A course with this name already exist' })
      }

      const insertCourse = await CourseModel.store(body)

      return res.status(201).json({ ...insertCourse })
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }
}

export default new CourseController()
