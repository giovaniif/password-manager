import { container } from 'tsyringe'

import { CreatePasswordService } from '@domains/password/services/CreatePasswordService'
import { badRequest, HttpRequest, HttpResponse, ok, serverError } from '@shared/infra/http/helpers/http'
import { IController } from '@shared/infra/http/interfaces/IController'

export class CreatePasswordsController implements IController {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const user_id = httpRequest.user.id
    const { title, value } = httpRequest.body

    const createPassword = container.resolve(CreatePasswordService)

    try {
      const passwordOrError = await createPassword.execute({
        userId: user_id,
        title,
        value
      })

      if (passwordOrError.isLeft())
        return badRequest(passwordOrError.value)

      const password = passwordOrError.value
      delete password.value

      return ok(password)
    } catch (err) {
      return serverError(err.message)
    }
  }
}
