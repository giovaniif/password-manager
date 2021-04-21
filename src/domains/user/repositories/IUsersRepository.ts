import { ICreateUserDTO } from '@domains/user/dtos/ICreateUserDTO'
import { InvalidEmailError, InvalidUserIdError } from '@shared/errors/User'
import { User } from '@domains/user/models/User'
import { Either } from '@shared/Either'

export interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<Either<Error, User>>
  findByEmail(email: string): Promise<Either<InvalidEmailError, User>>
  findById(id: string): Promise<Either<InvalidUserIdError, User>>
  setVerified(id: string): Promise<void>
}
