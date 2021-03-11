import { Router } from 'express'

import { PasswordsController } from '@controllers/PasswordsController'
import { ensureAuthenticated } from './middlewares/ensureAuthenticated'

const passwordRouter = Router()
const passwordsController = new PasswordsController()

passwordRouter.use(ensureAuthenticated)

passwordRouter.post('/', passwordsController.create)
passwordRouter.get('/', passwordsController.index)
passwordRouter.get('/:passwordId', passwordsController.show)

export { passwordRouter }