import { AppError } from '@errors/AppError'
import { FakeHashProvider } from '@providers/fakes/FakeHashProvider'
import { IHashProvider } from '@providers/IHashProvider'
import { FakeUsersRepository } from '@repositories/fakes/FakeUsersRepository'
import { IUsersRepository } from '@repositories/IUsersRepository'
import { AuthenticateUserService } from './AuthenticateUserService'
import { CreateUserService } from './CreateUserService'

let authenticateUser: AuthenticateUserService
let createUser: CreateUserService
let fakeUsersRepository: IUsersRepository
let fakeHashProvider: IHashProvider

describe('Authenticate user', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider()
    fakeUsersRepository = new FakeUsersRepository()

    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider)
  })

  it('should authenticate user', async () => {
    const user = await createUser.execute({
      email: 'riccog.25@gmail.com',
      password: '123123'
    })

    const session = await authenticateUser.execute({ ...user })

    expect(session).toHaveProperty('token')
    expect(session.user).toEqual(user)
  })

  it('should not authenticate a non existing user', async () => {
    await expect(authenticateUser.execute({
      email: 'non-existing-email@provider.com',
      password: '12345'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should not authenticate with wrong password', async () => {
    const user = await createUser.execute({
      email: 'riccog.25@gmail.com',
      password: '123123'
    })

    await expect(authenticateUser.execute({
      email: user.email,
      password: 'wrong-password'
    })).rejects.toBeInstanceOf(AppError)
  })
})