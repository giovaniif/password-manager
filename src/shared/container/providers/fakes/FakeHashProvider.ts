import { IHashProvider } from '@shared/container/providers/models/IHashProvider'

export class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return payload
  }

  public async compare(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed
  }
}
