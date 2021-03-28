import { FakeUsersRepository } from '@domains/user/repositories/fakes/FakeUsersRepository'
import { CreateUserService } from '@domains/user/services/CreateUserService'
import { IHashProvider } from '@shared/container/providers/models/IHashProvider'
import { IUsersRepository } from '@domains/user/repositories/IUsersRepository'
import { FakeHashProvider } from '@shared/container/providers/fakes/FakeHashProvider'
import { User } from '../models/User'

let createUserService: CreateUserService
let fakeUsersRepository: IUsersRepository
let fakeHashProvider: IHashProvider

describe('SignUp', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    )
  })

  it('should return error when trying to create user with repeated email', async () => {
    await fakeUsersRepository.create({
      email: 'riccog.25@gmail.com',
      password: '123123',
    })

    const userOrError = await createUserService.execute({
      email: 'riccog.25@gmail.com',
      password: '123123',
    })

    expect(userOrError.isLeft()).toBeTruthy()
  })

  it('should return error when trying to create user with a password smaller than 4 digits', async () => {
    const userOrError = await createUserService.execute({
      email: 'riccog.25@gmail.com',
      password: '123',
    })

    expect(userOrError.isLeft()).toBeTruthy()
  })

  it('should create a user if valid info is provided', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

    const userOrError = await createUserService.execute({
      email: 'riccog.25@gmail.com',
      password: '123123',
    })

    expect(userOrError.isRight()).toBeTruthy()
    expect(generateHash).toHaveBeenCalled()
  })

  it('should create new users as invalid users', async () => {
    const userOrError = await createUserService.execute({
      email: 'riccog.25@gmail.com',
      password: '123123',
    })

    const user = userOrError.isRight() ? userOrError.value : ({} as User)

    expect(user.isValid).toBe(false)
  })
})
