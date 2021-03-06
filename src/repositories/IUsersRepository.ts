import { ICreateUserDTO } from '@dtos/ICreateUserDTO'
import { User } from '@models/User'

export interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>
  findByEmail(email: string): Promise<User | undefined>
}