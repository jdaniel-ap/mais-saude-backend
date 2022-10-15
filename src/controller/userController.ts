import UserService from '../services/userService'
import { Request, Response } from 'express'
import { httpStatus } from '../utils/httpstatus'

class UserController {
  public async store (req: Request, res: Response): Promise<Response> {
    const { body } = req
    const service = await UserService.execute(body)
    return res.status(httpStatus[service.status]).json(service)
  }
}

export default new UserController()
