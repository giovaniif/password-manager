import { container } from 'tsyringe'

import { CreateUserService } from '@domains/user/services/CreateUserService'
import { badRequest, HttpRequest, HttpResponse, ok, serverError } from '@shared/infra/http/helpers/http'

export class UsersController {
  public async create(httpRequest: HttpRequest): Promise<HttpResponse> {
    const createUser = container.resolve(CreateUserService)

    const { email, password } = httpRequest.body

    try {
      const userOrError = await createUser.execute({ email, password })

      if (userOrError.isLeft())
        return badRequest(userOrError.value)

      const user = userOrError.value
      return ok(user)
    } catch (err) {
      return serverError(err.message)
    }
  }
}
