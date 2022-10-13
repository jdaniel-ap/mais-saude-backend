import { Router } from 'express'
import CourseController from './controller/coursesController'
import UserController from './controller/userController'

const routes = Router()

routes.get('/checkhealth', (_req, res) => {
  res.json({ message: 'online' })
})

routes.post('/course', CourseController.store)
routes.get('/courses', CourseController.list)
routes.put('/course/:id', CourseController.update)

routes.post('/user', UserController.store)

export default routes
