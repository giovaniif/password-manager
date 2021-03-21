import { container } from 'tsyringe'

import { AuthenticateUserService } from '@domains/user/services/AuthenticateUserService'
import { badRequest, HttpRequest, HttpResponse, ok, serverError } from '@shared/infra/http/helpers/http'

export class SessionsController {
  public async create(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body

    const authUser = container.resolve(AuthenticateUserService)

    try {
      const authenticateUserResponse = await authUser.execute({ email, password })

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