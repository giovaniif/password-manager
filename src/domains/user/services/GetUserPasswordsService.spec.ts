import { FakePasswordsRepository } from '@domains/password/repositories/fakes/FakePasswordsRepository'
import { IPasswordsRepository } from '@domains/password/repositories/IPasswordsRepository'
import { FakeUsersRepository } from '@domains/user/repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '@domains/user/repositories/IUsersRepository'
import { GetUserPasswordsService } from './GetUserPasswordsService'

let getUserPasswords: GetUserPasswordsService
let fakeUsersRepository: IUsersRepository
let fakePasswordsRepository: IPasswordsRepository

describe('Get user passwords', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakePasswordsRepository = new FakePasswordsRepository()
    getUserPasswords = new GetUserPasswordsService(
      fakePasswordsRepository,
      fakeUsersRepository,
    )
  })

  it('should return user passwords', async () => {
    const userOrError = await fakeUsersRepository.create({
      email: 'riccog.25@gmail.com',
      password: '123123',
    })

    let user
    if (userOrError.isRight()) user = userOrError.value

    await fakePasswordsRepository.create({
      title: 'Password 1',
      value: '1234',
      userId: user.id,
    })

    await fakePasswordsRepository.create({
      title: 'Password 3',
      value: '12345',
      userId: user.id,
    })

    const passwords = await getUserPasswords.execute({ userId: user.id })

    expect(passwords.isRight()).toBeTruthy()
  })

  it('should return error if the user does not exist', async () => {
    const passwordsOrError = await getUserPasswords.execute({
      userId: 'non-existing-user-id',
    })

    expect(passwordsOrError.isLeft()).toBeTruthy()
  })
})
