import UserModel from '../model/userModel'
import { Request, Response } from 'express'

class UserController {
  public async store (req: Request, res: Response): Promise<Response> {
    const { body } = req
    const request = await UserModel.store(body)
    return res.json(request)
  }
}

export default new UserController()
