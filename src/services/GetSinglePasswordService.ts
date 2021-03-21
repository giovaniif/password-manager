import { inject, injectable } from 'tsyringe'

import { IGetSinglePasswordServiceDTO } from '@dtos/IGetSinglePasswordServiceDTO'
import { InvalidPasswordIdError } from '@errors/Password'
import { InvalidUserIdError } from '@errors/User'
import { Password } from '@models/Password'
import { IEncryptionProvider } from '@shared/container/providers/models/IEncryptionProvider'
import { IPasswordsRepository } from '@repositories/IPasswordsRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { Either, left, right } from '@shared/Either'

type IResponse = Either<InvalidUserIdError | InvalidPasswordIdError, Password>

@injectable()
export class GetSinglePasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PasswordsRepository')
    private passwordsRepository: IPasswordsRepository,

    @inject('EncryptionProvider')
    private encryptionProvider: IEncryptionProvider
  ) { }

  public async execute({ passwordId, userId }: IGetSinglePasswordServiceDTO): Promise<IResponse> {
    const userOrError = await this.usersRepository.findById(userId)
    if (userOrError.isLeft()) return left(userOrError.value)

    const encryptedPasswordOrError = await this.passwordsRepository.getSingle(passwordId)
    if (encryptedPasswordOrError.isLeft()) return left(encryptedPasswordOrError.value)

    const encryptedPassword = encryptedPasswordOrError.value.value
    const decryptedPassword = encryptedPasswordOrError.value
    decryptedPassword.value = this.encryptionProvider.decrypt(encryptedPassword)

    return right(decryptedPassword)
  }
}
