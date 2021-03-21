import { HttpRequest, HttpResponse } from '../helpers/http'

export interface IController {
  handle(httpRequest: HttpRequest): Promise<HttpResponse>
}
