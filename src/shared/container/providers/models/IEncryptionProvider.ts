export interface IEncryptionProvider {
  encrypt(toBeEncrypted: string): string
  decrypt(toBeDecrypted: string): string
}
