
import { Request, Response } from 'express'

import { HttpRequest, HttpResponse } from '@shared/infra/http/helpers/http'
import { IController } from '../../interfaces/IController'

export const adaptRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = { ...req }

    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
