import { container } from 'tsyringe'

import { GetSinglePasswordService } from '@domains/password/services/GetSinglePasswordService'

import { badRequest, HttpRequest, HttpResponse, ok, serverError } from '@shared/infra/http/helpers/http'
import { IController } from '@shared/infra/http/interfaces/IController'

export class GetSinglePasswordController implements IController {
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const user_id = httpRequest.user.id
    const { passwordId } = httpRequest.params

    const getSinglePassword = container.resolve(GetSinglePasswordService)

    try {
      const passwordOrError = await getSinglePassword.execute({
        passwordId,
        userId: user_id
      })

      if (passwordOrError.isLeft())
        return badRequest(passwordOrError.value)

      return ok(passwordOrError.value)
    } catch (err) {
      return serverError(err.message)
    }
  }
}
