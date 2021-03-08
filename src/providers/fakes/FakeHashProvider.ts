import { IHashProvider } from '@providers/IHashProvider'

export class FakeHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    const hashed = `123${payload}123`
    return hashed
  }

  public async compare(payload: string, hashed: string): Promise<boolean> {
    return payload === hashed
  }
}
