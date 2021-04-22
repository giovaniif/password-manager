import { ISendMailDTO } from '../dtos/ISendMailDTO'
import { IMailProvider } from '../models/IMailProvider'

export class FakeMailProvider implements IMailProvider {
  mails: ISendMailDTO[] = []

  async sendMail(data: ISendMailDTO): Promise<void> {
    this.mails.push(data)
  }
}
