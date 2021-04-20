import 'dotenv/config'

import { inject, injectable } from 'tsyringe'
import sendGridMail from '@sendgrid/mail'

import { Either, left, right } from '@shared/Either'
import { InvalidUserIdError } from '@shared/errors/User'
import { IUsersRepository } from '../repositories/IUsersRepository'

interface ISendMailDTO {
  address: string
  name: string
}

type IResponse = Either<InvalidUserIdError | Error, any>

sendGridMail.setApiKey(process.env.SEND_GRID_API_KEY)
@injectable()
export class SendVerificationEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(userId: string): Promise<IResponse> {
    if (!userId) return left(new InvalidUserIdError())

    const userOrError = await this.usersRepository.findById(userId)
    if (userOrError.isLeft()) return left(new InvalidUserIdError())

    const user = userOrError.value

    try {
      const message = await this.sendMail({
        address: user.email,
        name: user.email,
      })

      return right(message)
    } catch (err) {
      console.log(err)
      return left(new Error('Something went wrong, please try again'))
    }
  }

  private async sendMail({ address }: ISendMailDTO) {
    const message = {
      to: address,
      from: process.env.SEND_GRID_MAIL, // Use the email address or domain you verified above
      subject: 'Verify Account || Password Manager',
      text: 'Please verify your account',
    }

    await sendGridMail.send(message)
  }
}
