import { compare, hash } from 'bcryptjs'

import { IHashProvider } from '@shared/container/providers/models/IHashProvider'

export class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return hash(payload, 8)
  }

  public async compare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed)
  }
}
