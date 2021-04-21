import { inject, injectable } from 'tsyringe'

import { Either, left, right } from '@shared/Either'
import { InvalidUserIdError } from '@shared/errors/User'
import { IUsersRepository } from '../repositories/IUsersRepository'
import { User } from '../models/User'

type IResponse = Either<InvalidUserIdError | Error, User>

@injectable()
export class SetUserVerifiedService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(userId: string): Promise<IResponse> {
    if (!userId) return left(new InvalidUserIdError())

    const userOrError = await this.usersRepository.findById(userId)
    if (userOrError.isLeft()) return left(new InvalidUserIdError())

    try {
      const verifiedUser = await this.usersRepository.setVerified(userId)

      return right(verifiedUser)
    } catch (err) {
      console.log(err)
      return left(new Error(err.message))
    }
  }
}
