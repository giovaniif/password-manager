import { IPasswordDTO } from './IPasswordDTO'

export interface ICreatePasswordDTO {
  userId: string
  password: IPasswordDTO
}