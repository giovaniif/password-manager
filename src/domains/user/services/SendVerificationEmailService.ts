import 'dotenv/config'

import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { createTransport, getTestMessageUrl, Transporter } from 'nodemailer'
import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@shared/Either'
import { InvalidUserIdError } from '@shared/errors/User'
import { IUsersRepository } from '../repositories/IUsersRepository'

interface ISendMailDTO {
  address: string
  name: string
}

type IResponse = Either<InvalidUserIdError, any>
@injectable()
export class SendVerificationEmailService {
  private transporter: Transporter

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(userId: string): Promise<IResponse> {
    if (!userId) return left(new InvalidUserIdError())

    const userOrError = await this.usersRepository.findById(userId)
    if (userOrError.isLeft()) return left(new InvalidUserIdError())

    const user = userOrError.value
    const message = await this.sendMail({
      address: user.email,
      name: user.email,
    })

    return right(message)
  }

  private async sendMail(to: ISendMailDTO) {
    await this.makeTransporter()

    const message = await this.transporter.sendMail({
      from: {
        address: 'riccog.25@gmail.com',
        name: 'Giovani',
      },
      to,
      subject: 'Password manager',
      text: 'Teste de email',
    })

    console.log('Message sent', message.messageId)
    console.log('Preview url', getTestMessageUrl(message))
    return message
  }

  private async makeTransporter() {
    this.transporter = createTransport({
      port: 2525,
      host: 'smtp.mailtrap.io',
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASSWORD,
      },
    } as SMTPTransport.Options)
  }
}
