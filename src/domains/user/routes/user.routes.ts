import { Router } from 'express'

import { UsersController } from '@domains/user/controllers/UsersController'
import { adaptRoute } from '@shared/infra/http/routes/middlewares/adaptRoute'

const userRouter = Router()
const usersController = new UsersController()

userRouter.post('/', adaptRoute(usersController.create))

export { userRouter }
