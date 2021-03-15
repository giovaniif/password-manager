import { HttpRequest, HttpResponse } from '@shared/helpers/http'

export interface IController {
  create?: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
