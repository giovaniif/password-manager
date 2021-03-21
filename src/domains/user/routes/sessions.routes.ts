import { Router } from 'express'

import { CreateSessionsController } from '@domains/user/controllers/CreateSessionController'
import { adaptRoute } from '@shared/infra/http/routes/middlewares/adaptRoute'

const createSessions = new CreateSessionsController()
const sessionsRouter = Router()

sessionsRouter.post('/', adaptRoute(createSessions))

export { sessionsRouter }
