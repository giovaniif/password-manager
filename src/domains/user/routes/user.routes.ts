import { Router } from 'express'

import { CreateUserController } from '@domains/user/controllers/CreateUserController'
import { adaptRoute } from '@shared/infra/http/routes/middlewares/adaptRoute'

const userRouter = Router()
const createUsers = new CreateUserController()

userRouter.post('/', adaptRoute(createUsers))

export { userRouter }
