import { Router } from 'express'

import { SessionsController } from '@domains/user/controllers/SessionsController'
import { adaptRoute } from '@shared/infra/http/routes/middlewares/adaptRoute'

const sessionsController = new SessionsController()
const sessionsRouter = Router()

sessionsRouter.post('/', adaptRoute(sessionsController.create))

export { sessionsRouter }
