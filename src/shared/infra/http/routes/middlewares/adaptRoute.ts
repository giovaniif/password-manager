import { Request, Response } from 'express'

import { HttpRequest, HttpResponse } from '@shared/infra/http/helpers/http'
import { IController } from '../../interfaces/IController'

export const adaptRoute = (controller: IController) => {
  return async (req: Request, res: Response): Promise<HttpResponse> => {
    const httpRequest: HttpRequest = { ...req }

    const httpResponse = await controller.handle(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
