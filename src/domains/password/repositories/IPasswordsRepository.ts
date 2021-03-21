import { ICreatePasswordDTO } from '@domains/password/dtos/ICreatePasswordDTO'
import { IGetUserPasswordsDTO } from '@domains/user/dtos/IGetUserPasswordsDTO'
import { InvalidPasswordIdError } from '@shared/errors/Password'
import { Password } from '@domains/password/models/Password'
import { Either } from '@shared/Either'

export interface IPasswordsRepository {
  create(passwordData: ICreatePasswordDTO): Promise<Either<Error, Password>>
  getAllFromUser(userData: IGetUserPasswordsDTO): Promise<Password[]>
  getSingle(passwordId: string): Promise<Either<InvalidPasswordIdError, Password>>
}
