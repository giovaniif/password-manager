import { ICreatePasswordDTO } from '@dtos/ICreatePasswordDTO'
import { Password } from '@models/Password'

export interface IPasswordsRepository {
  create(passwordData: ICreatePasswordDTO): Promise<Password>
}