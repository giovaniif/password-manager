import { container } from 'tsyringe'

import { IController } from '@shared/infra/http/interfaces/IController'
import {
  badRequest,
  HttpRequest,
  HttpResponse,
  ok,
  serverError,
} from '@shared/infra/http/helpers/http'
import { SetUserVerifiedService } from '../services/SetUserVerifiedService'

export class SetUserVerifiedController implements IController {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const setVerified = container.resolve(SetUserVerifiedService)

    const { userId } = httpRequest.params

    try {
      const userOrError = await setVerified.execute(userId)

      if (userOrError.isLeft()) return badRequest(userOrError.value)

      const user = userOrError.value
      return ok(user)
    } catch (err) {
      return serverError(err.message)
    }
  }
}
