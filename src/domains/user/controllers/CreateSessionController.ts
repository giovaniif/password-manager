import { container } from 'tsyringe'

import { AuthenticateUserService } from '@domains/user/services/AuthenticateUserService'
import {
  badRequest,
  HttpRequest,
  HttpResponse,
  ok,
  serverError,
} from '@shared/infra/http/helpers/http'
import { IController } from '@shared/infra/http/interfaces/IController'

export class CreateSessionsController implements IController {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    const authUser = container.resolve(AuthenticateUserService)

    try {
      const authenticateUserResponse = await authUser.execute({
        email,
        password,
      })

      if (authenticateUserResponse.isLeft()) {
        return badRequest(authenticateUserResponse.value)
      }

      const { token, user } = authenticateUserResponse.value
      delete user.password

      return ok({ token, user })
    } catch (err) {
      return serverError(err.message)
    }
  }
}
