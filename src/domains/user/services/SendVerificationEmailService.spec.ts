import { User } from '../models/User'
import { FakeUsersRepository } from '../repositories/fakes/FakeUsersRepository'
import { SendVerificationEmailService } from './SendVerificationEmailService'

const makeSut = () => {
  const fakeUsersRepository = new FakeUsersRepository()
  const sut = new SendVerificationEmailService(fakeUsersRepository)

  return { sut, fakeUsersRepository }
}

describe('Send verification email', () => {
  it('should return an error if no user id is provided', async () => {
    const { sut } = makeSut()

    const promise = await sut.execute('')

    expect(promise.isLeft()).toBeTruthy()
  })

  it('should return an error if an invalid user id is provided', async () => {
    const { sut } = makeSut()

    const promise = await sut.execute('invalid-user-id')

    expect(promise.isLeft()).toBeTruthy()
  })

  it('should send an email', async () => {
    const { fakeUsersRepository, sut } = makeSut()
    const fakeUser = await fakeUsersRepository.create({
      email: 'my-email@email.com',
      password: '123123',
    })

    const user = fakeUser.isRight() ? fakeUser.value : ({} as User)

    const message = await sut.execute(user.id)
    expect(message.isRight()).toBeTruthy()
    expect(message.value).toHaveProperty('messageId')
  })
})
