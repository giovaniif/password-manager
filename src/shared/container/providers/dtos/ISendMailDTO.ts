import { IParseMailTemplateDTO } from './IParseMailTemplateDTO'

export interface ISendMailDTO {
  to: string
  from?: string
  subject: string
  templateData: IParseMailTemplateDTO
}
