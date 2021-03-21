import { Router } from 'express'

import { passwordRouter } from '@domains/password/routes/password.routes'
import { sessionsRouter } from '@domains/user/routes/sessions.routes'
import { userRouter } from '@domains/user/routes/user.routes'

const routes = Router()

routes.use('/sessions', sessionsRouter)
routes.use('/users', userRouter)
routes.use('/passwords', passwordRouter)

export { routes }
