import { Router } from 'express'

import { CreateUserController } from '@domains/user/controllers/CreateUserController'
import { adaptRoute } from '@shared/infra/http/routes/middlewares/adaptRoute'
import { SetUserVerifiedController } from '../controllers/SetUserVerifiedController'

const userRouter = Router()
const createUsers = new CreateUserController()
const setVerified = new SetUserVerifiedController()

userRouter.post('/', adaptRoute(createUsers))
userRouter.post('/verify/:id', adaptRoute(setVerified))

export { userRouter }
