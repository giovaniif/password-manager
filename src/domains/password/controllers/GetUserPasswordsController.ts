import { container } from 'tsyringe'

import { GetUserPasswordsService } from '@domains/user/services/GetUserPasswordsService'

import { badRequest, HttpRequest, HttpResponse, ok, serverError } from '@shared/infra/http/helpers/http'
import { IController } from '@shared/infra/http/interfaces/IController'

export class GetUserPasswordsController implements IController {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const user_id = httpRequest.user.id

    const getPasswords = container.resolve(GetUserPasswordsService)

    try {
      const passwordsOrError = await getPasswords.execute({ userId: user_id })

      if (passwordsOrError.isLeft())
        return badRequest(passwordsOrError.value)

      return ok(passwordsOrError.value)
    } catch (err) {
      return serverError(err.message)
    }
  }
}
