import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

interface ISendMailDTO {
  to: string
}

export class SendVerificationEmailService {
  public async execute({ to }: ISendMailDTO): Promise<any> {
    const account = await createTestAccount()

    const transporter = createTransport({
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
      host: account.smtp.host,
    } as SMTPTransport.Options)
    // Used this to fix the types issues with @types/nodemailer

    const message = await transporter.sendMail({
      from: {
        address: 'riccog.25@gmail.com',
        name: 'Giovani',
      },
      to: {
        address: to,
        name: 'Receptor',
      },
      subject: 'Password manager',
      text: 'Teste de email',
    })

    console.log('Message sent', message.messageId)
    console.log('Preview url', getTestMessageUrl(message))

    return message
  }
}
