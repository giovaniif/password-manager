import { FakeHashProvider } from '@shared/container/providers/fakes/FakeHashProvider'
import { IHashProvider } from '@shared/container/providers/models/IHashProvider'
import { FakeUsersRepository } from '@domains/user/repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '@domains/user/repositories/IUsersRepository'
import { AuthenticateUserService } from './AuthenticateUserService'

let authenticateUser: AuthenticateUserService
let fakeUsersRepository: IUsersRepository
let fakeHashProvider: IHashProvider

describe('Authenticate user', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider()
    fakeUsersRepository = new FakeUsersRepository()

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )
  })

  it('should authenticate user', async () => {
    const userOrError = await fakeUsersRepository.create({
      email: 'new-user@provider.com',
      password: '123123',
    })

    let user
    if (userOrError.isRight()) {
      user = userOrError.value
    }

    const authenticateUserResponse = await authenticateUser.execute({ ...user })

    expect(authenticateUserResponse.isRight()).toBeTruthy()
  })

  it('should not authenticate a non existing user', async () => {
    const authenticateUserResponse = await authenticateUser.execute({
      email: 'non-existing-email@provider.com',
      password: '12345',
    })

    expect(authenticateUserResponse.isLeft()).toBeTruthy()
    expect(authenticateUserResponse.value).toBeInstanceOf(Error)
  })

  it('should not authenticate with wrong password', async () => {
    const userOrError = await fakeUsersRepository.create({
      email: 'new-user@provider.com',
      password: '123123',
    })

    let user
    if (userOrError.isRight()) {
      user = userOrError.value
    }

    const authenticateUserResponse = await authenticateUser.execute({
      email: user.email,
      password: 'wrong-password',
    })

    expect(authenticateUserResponse.isLeft()).toBeTruthy()
    expect(authenticateUserResponse.value).toBeInstanceOf(Error)
  })
})
