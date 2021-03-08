import { Router } from 'express'

import { PasswordsController } from '@controllers/PasswordsController'

const passwordRouter = Router()
const passwordsController = new PasswordsController()

passwordRouter.post('/', passwordsController.create)

export { passwordRouter }