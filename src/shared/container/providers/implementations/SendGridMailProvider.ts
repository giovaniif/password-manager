import sendGridMail from '@sendgrid/mail'
import { inject, injectable } from 'tsyringe'

import { ISendMailDTO } from '../dtos/ISendMailDTO'
import { IMailProvider } from '../models/IMailProvider'
import { IMailTemplateProvider } from '../models/IMailTemplateProvider'

sendGridMail.setApiKey(process.env.SEND_GRID_API_KEY)

@injectable()
export class SendGridMailProvider implements IMailProvider {
  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {}

  public async sendMail({
    subject,
    templateData,
    to,
    from,
  }: ISendMailDTO): Promise<void> {
    const message = {
      to,
      from: from || process.env.SEND_GRID_MAIL,
      subject: subject,
      html: await this.mailTemplateProvider.parse(templateData),
    }

    await sendGridMail.send(message)
  }
}
