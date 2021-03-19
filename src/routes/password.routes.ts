import { Router } from 'express'

import { PasswordsController } from '@controllers/PasswordsController'
import { ensureAuthenticated } from './middlewares/ensureAuthenticated'
import { adaptRoute } from './middlewares/adaptRoute'
import { HttpRequest, HttpResponse } from '@shared/helpers/http'

const passwordRouter = Router()
const passwordsController = new PasswordsController()

passwordRouter.use((request, response, next) =>
  ensureAuthenticated(request as HttpRequest, response as HttpResponse, next
  ))

passwordRouter.post('/', adaptRoute(passwordsController.create))
passwordRouter.get('/', passwordsController.index)
passwordRouter.get('/:passwordId', adaptRoute(passwordsController.show))

export { passwordRouter }