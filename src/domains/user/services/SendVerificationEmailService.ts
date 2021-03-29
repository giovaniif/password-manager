import { Either, left } from '@shared/Either'
import { InvalidUserIdError } from '@shared/errors/User'
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
  TestAccount,
  Transporter,
} from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { inject, injectable } from 'tsyringe'
import { IUsersRepository } from '../repositories/IUsersRepository'

interface ISendMailDTO {
  address: string
  name: string
}

type IResponse = Either<InvalidUserIdError, void>
@injectable()
export class SendVerificationEmailService {
  private account: TestAccount
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
    await this.sendMail({ address: user.email, name: user.email })
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
  }

  private async makeTransporter() {
    await this.makeAccount()

    this.transporter = createTransport({
      port: this.account.smtp.port,
      secure: this.account.smtp.secure,
      auth: {
        user: this.account.user,
        pass: this.account.pass,
      },
      host: this.account.smtp.host,
    } as SMTPTransport.Options)
  }

  private async makeAccount() {
    const account = await createTestAccount()
    this.account = account
  }
}
