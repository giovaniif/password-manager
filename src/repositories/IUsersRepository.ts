import { ICreateUserDTO } from '@dtos/ICreateUserDTO'
import { InvalidEmailError } from '@errors/User'
import { User } from '@models/User'
import { Either } from '@shared/Either'

export interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>
  findByEmail(email: string): Promise<Either<InvalidEmailError, User>>
  findById(id: string): Promise<User | undefined>
}