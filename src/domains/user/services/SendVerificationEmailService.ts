import 'dotenv/config'

import { inject, injectable } from 'tsyringe'
import path from 'path'

import { Either, left, right } from '@shared/Either'
import { InvalidUserIdError } from '@shared/errors/User'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { IMailProvider } from '@shared/container/providers/models/IMailProvider'

type IResponse = Either<InvalidUserIdError | Error, any>

@injectable()
export class SendVerificationEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute(userId: string): Promise<IResponse> {
    if (!userId) return left(new InvalidUserIdError())

    const userOrError = await this.usersRepository.findById(userId)
    if (userOrError.isLeft()) return left(new InvalidUserIdError())

    const user = userOrError.value

    const link = this.getResetPasswordLink(userId)

    try {
      const message = await this.mailProvider.sendMail({
        subject: 'Verify your account || Password Manager',
        templateData: {
          file: this.getSendVerificationEmailTemplateFile(),
          variables: {
            link,
          },
        },
        to: user.email,
      })

      return right(message)
    } catch (err) {
      console.log(err)
      return left(new Error('Something went wrong, please try again'))
    }
  }

  private getResetPasswordLink(userId: string): string {
    return `${process.env.APP_API_URL}/verify/${userId}`
  }

  private getSendVerificationEmailTemplateFile(): string {
    const sendVerificationTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'verify-email.hbs',
    )

    return sendVerificationTemplate
  }
}
