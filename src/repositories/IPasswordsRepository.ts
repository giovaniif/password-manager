import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { IGetSinglePasswordServiceDTO } from '@dtos/IGetSinglePasswordServiceDTO'
import { IGetUserPasswordsDTO } from '@dtos/IGetUserPasswordsDTO'
import { Password } from '@models/Password'
import { Either } from '@shared/Either'

export interface IPasswordsRepository {
  create(passwordData: ICreatePasswordDTO): Promise<Either<Error, Password>>
  getAllFromUser(userData: IGetUserPasswordsDTO): Promise<Password[]>
  getSingle(passwordId: string): Promise<Password | undefined>
}
