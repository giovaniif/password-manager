import { IEncryptionProvider } from '@providers/IEncryptionProvider'

export class FakeEncryptionProvider implements IEncryptionProvider {
  public encrypt(toBeEncrypted: string): string {
    return toBeEncrypted
  }

  public decrypt(toBeDecrypted: string): string {
    return toBeDecrypted
  }
}
