import { Router } from 'express'

import { UsersController } from '@controllers/UsersController'
import { adaptRoute } from './middlewares/adaptRoute'

const userRouter = Router()
const usersController = new UsersController()

userRouter.post('/', adaptRoute(usersController.create))

export { userRouter }
