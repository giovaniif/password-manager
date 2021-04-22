import { inject, injectable } from 'tsyringe'
import path from 'path'

import { User } from '@domains/user/models/User'
import { IUsersRepository } from '@domains/user/repositories/IUsersRepository'
import { ICreateUserDTO } from '@domains/user/dtos/ICreateUserDTO'
import { IHashProvider } from '@shared/container/providers/models/IHashProvider'
import { Either, left, right } from '@shared/Either'
import { PasswordTooShortError, RepeatedEmailError } from '@shared/errors/User'
import { IMailProvider } from '@shared/container/providers/models/IMailProvider'
import { ISendMailDTO } from '@shared/container/providers/dtos/ISendMailDTO'

type IResponse = Either<RepeatedEmailError | PasswordTooShortError, User>

@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({
    email,
    password,
  }: ICreateUserDTO): Promise<IResponse> {
    const repeatedUser = await this.usersRepository.findByEmail(email)

    if (repeatedUser.isRight()) return left(new RepeatedEmailError())

    if (password.length < 4) return left(new PasswordTooShortError())

    const hashedPassword = await this.hashProvider.generateHash(password)

    const userOrError = await this.usersRepository.create({
      email,
      password: hashedPassword,
    })

    if (userOrError.isLeft()) return left(userOrError.value)

    const link = this.getSendVerificationMailLink(userOrError.value.id)

    await this.sendVerificationMail({
      subject: 'Verify your account || Password Manager',
      templateData: {
        file: this.getSendVerificationEmailTemplateFile(),
        variables: {
          link,
        },
      },
      to: userOrError.value.email,
    })

    return right(userOrError.value)
  }

  private getSendVerificationMailLink(userId: string): string {
    return `${process.env.APP_API_URL}:${process.env.APP_PORT}/verify.html?id=${userId}`
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

  private async sendVerificationMail(
    sendMailData: ISendMailDTO,
  ): Promise<void> {
    await this.mailProvider.sendMail(sendMailData)
  }
}
