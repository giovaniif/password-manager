import { Router } from 'express'

import { SessionsController } from '@controllers/SessionsController'
import { adaptRoute } from './middlewares/adaptRoute'

const sessionsController = new SessionsController()
const sessionsRouter = Router()

sessionsRouter.post('/', adaptRoute(sessionsController.create))

export { sessionsRouter }
