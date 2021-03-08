import { Router } from 'express'

import { passwordRouter } from './password.routes'
import { userRouter } from './user.routes'

const routes = Router()

routes.use('/users', userRouter)
routes.use('/passwords', passwordRouter)

export { routes }
