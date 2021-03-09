import { Router } from 'express'

import { passwordRouter } from './password.routes'
import { sessionsRouter } from './sessions.routes'
import { userRouter } from './user.routes'

const routes = Router()

routes.use('/sessions', sessionsRouter)
routes.use('/users', userRouter)
routes.use('/passwords', passwordRouter)

export { routes }
