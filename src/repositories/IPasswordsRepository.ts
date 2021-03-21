import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { IGetUserPasswordsDTO } from '@dtos/IGetUserPasswordsDTO'
import { InvalidPasswordIdError } from '@errors/Password'
import { InvalidUserIdError } from '@errors/User'
import { Password } from '@models/Password'
import { Either } from '@shared/Either'

export interface IPasswordsRepository {
  create(passwordData: ICreatePasswordDTO): Promise<Either<Error, Password>>
  getAllFromUser(userData: IGetUserPasswordsDTO): Promise<Password[]>
  getSingle(passwordId: string): Promise<Either<InvalidPasswordIdError, Password>>
}
