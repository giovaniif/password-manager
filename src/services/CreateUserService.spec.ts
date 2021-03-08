import { FakeUsersRepository } from '@repositories/fakes/FakeUsersRepository'
import { AppError } from '@errors/AppError'
import { CreateUserService } from '@services/CreateUserService'

let createUserService: CreateUserService
let fakeUsersRepository: FakeUsersRepository

describe('SignUp', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    createUserService = new CreateUserService(fakeUsersRepository)
  })

  it('should return error when trying to create user with repeated email', async () => {
    await createUserService.execute({
      email: 'riccog.25@gmail.com',
      password: '123123'
    })

    await expect(
      createUserService.execute({
        email: 'riccog.25@gmail.com',
        password: '123123'
      })).rejects.toBeInstanceOf(AppError)
  })

  it('should return error when trying to create user with a password smaller than 4 digits', async () => {
    await expect(createUserService.execute({
      email: 'riccog.25@gmail.com',
      password: '123'
    })).rejects.toBeInstanceOf(AppError)
  })

  it('should create a user if valid info is provided', async () => {
    const user = await createUserService.execute({
      email: 'riccog.25@gmail.com',
      password: '123123'
    })

    expect(user).toHaveProperty('id')
  })
})