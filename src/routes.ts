import { Router } from 'express'
import CourseController from './controller/coursesController'

const routes = Router()

routes.get('/checkhealth', (_req, res) => {
  res.json({ message: 'online' })
})

routes.post('/course', CourseController.store)
routes.get('/courses', CourseController.list)

export default routes
