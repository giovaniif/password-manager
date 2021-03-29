import { Either, left } from '@shared/Either'
import { InvalidUserIdError } from '@shared/errors/User'
import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { inject, injectable } from 'tsyringe'
import { IUsersRepository } from '../repositories/IUsersRepository'

interface ISendMailDTO {
  userId: string
}

type IResponse = Either<InvalidUserIdError, void>
@injectable()
export class SendVerificationEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: ISendMailDTO): Promise<IResponse> {
    if (!userId) return left(new InvalidUserIdError())

    const userOrError = await this.usersRepository.findById(userId)

    if (userOrError.isLeft()) return left(new InvalidUserIdError())
    // const account = await createTestAccount()
    // const transporter = createTransport({
    //   port: account.smtp.port,
    //   secure: account.smtp.secure,
    //   auth: {
    //     user: account.user,
    //     pass: account.pass,
    //   },
    //   host: account.smtp.host,
    // } as SMTPTransport.Options)
    // // Used this to fix the types issues with @types/nodemailer
    // const message = await transporter.sendMail({
    //   from: {
    //     address: 'riccog.25@gmail.com',
    //     name: 'Giovani',
    //   },
    //   to: {
    //     address: to,
    //     name: 'Receptor',
    //   },
    //   subject: 'Password manager',
    //   text: 'Teste de email',
    // })
    // console.log('Message sent', message.messageId)
    // console.log('Preview url', getTestMessageUrl(message))
    // return message
  }
}
