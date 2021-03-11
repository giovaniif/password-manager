import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { IGetSinglePasswordServiceDTO } from '@dtos/IGetSinglePasswordServiceDTO'
import { IGetUserPasswordsDTO } from '@dtos/IGetUserPasswordsDTO'
import { Password } from '@models/Password'

export interface IPasswordsRepository {
  create(passwordData: ICreatePasswordDTO): Promise<Password>
  getAllFromUser(userData: IGetUserPasswordsDTO): Promise<Password[]>
  getSingle(passwordId: string): Promise<Password | undefined>
}
