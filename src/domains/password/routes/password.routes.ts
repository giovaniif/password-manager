import { Router } from 'express'

import { ensureAuthenticated } from '@shared/infra/http/routes/middlewares/ensureAuthenticated'
import { adaptRoute } from '@shared/infra/http/routes/middlewares/adaptRoute'
import { HttpRequest, HttpResponse } from '@shared/infra/http/helpers/http'

import { CreatePasswordsController } from '@domains/password/controllers/CreatePasswordController'
import { GetSinglePasswordController } from '@domains/password/controllers/GetSinglePasswordService'
import { GetUserPasswordsController } from '@domains/password/controllers/GetUserPasswordsController'

const passwordRouter = Router()
const createPassword = new CreatePasswordsController()
const getSinglePassword = new GetSinglePasswordController()
const getUserPasswords = new GetUserPasswordsController()

passwordRouter.use((request, response, next) =>
  ensureAuthenticated(request as HttpRequest, response as HttpResponse, next
  ))

passwordRouter.post('/', adaptRoute(createPassword))
passwordRouter.get('/', adaptRoute(getUserPasswords))
passwordRouter.get('/:passwordId', adaptRoute(getSinglePassword))

export { passwordRouter }
