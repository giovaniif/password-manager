import { ICreateUserDTO } from '@dtos/ICreateUserDTO'
import { InvalidEmailError, InvalidUserIdError } from '@errors/User'
import { User } from '@models/User'
import { Either } from '@shared/Either'

export interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<Either<Error, User>>
  findByEmail(email: string): Promise<Either<InvalidEmailError, User>>
  findById(id: string): Promise<Either<InvalidUserIdError, User>>
}