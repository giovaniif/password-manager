import { Router } from 'express'

import { PasswordsController } from '@domains/password/controllers/PasswordsController'
import { ensureAuthenticated } from '@shared/infra/http/routes/middlewares/ensureAuthenticated'
import { adaptRoute } from '@shared/infra/http/routes/middlewares/adaptRoute'
import { HttpRequest, HttpResponse } from '@shared/infra/http/helpers/http'

const passwordRouter = Router()
const passwordsController = new PasswordsController()

passwordRouter.use((request, response, next) =>
  ensureAuthenticated(request as HttpRequest, response as HttpResponse, next
  ))

passwordRouter.post('/', adaptRoute(passwordsController.create))
passwordRouter.get('/', adaptRoute(passwordsController.index))
passwordRouter.get('/:passwordId', adaptRoute(passwordsController.show))

export { passwordRouter }
