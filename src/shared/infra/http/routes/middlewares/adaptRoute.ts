
import { Request, Response } from 'express'

import { HttpRequest, HttpResponse } from '@shared/infra/http/helpers/http'

type IControllerMethod = (httpRequest: HttpRequest) => Promise<HttpResponse>

export const adaptRoute = (controllerMethod: IControllerMethod) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = { ...req }

    const httpResponse = await controllerMethod(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
