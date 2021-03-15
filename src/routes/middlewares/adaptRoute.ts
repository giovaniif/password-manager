
import { Request, Response } from 'express'

import { HttpRequest } from '@shared/helpers/http'
import { IController } from '@controllers/IController'

export const adaptRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.create(httpRequest)
    res.status(httpResponse.statusCode).json({ message: httpResponse.body })
  }
}
