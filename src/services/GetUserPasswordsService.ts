import { IGetUserPasswordsDTO } from '@dtos/IGetUserPasswordsDTO'
import { InvalidPasswordIdError } from '@errors/Password'
import { InvalidUserIdError } from '@errors/User'
import { Password } from '@models/Password'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { Either, left, right } from '@shared/Either'

type IResponse = Either<InvalidPasswordIdError, Password[]>

export class GetUserPasswordsService {
  constructor(
    private passwordsRepository: IPasswordsRepository,
    private usersRepository: IUsersRepository
  ) { }

  public async execute({ userId }: IGetUserPasswordsDTO): Promise<IResponse> {
    const userOrError = await this.usersRepository.findById(userId)

    if (userOrError.isLeft())
      return left(new InvalidUserIdError())

    const passwords = await this.passwordsRepository.getAllFromUser({ userId })

    return right(passwords)
  }
}
