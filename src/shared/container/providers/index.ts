import { container } from 'tsyringe'

import { BCryptHashProvider } from './implementations/BCryptHashProvider'
import { HandleBarsMailTemplateProvider } from './implementations/HandleBarsMailTemplateProvider'
import { SendGridMailProvider } from './implementations/SendGridMailProvider'
import { TDEAEncryptionProvider } from './implementations/TDEAEncryptionProvider'
import { IEncryptionProvider } from './models/IEncryptionProvider'
import { IHashProvider } from './models/IHashProvider'
import { IMailProvider } from './models/IMailProvider'
import { IMailTemplateProvider } from './models/IMailTemplateProvider'

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider)

container.registerSingleton<IEncryptionProvider>(
  'EncryptionProvider',
  TDEAEncryptionProvider,
)

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandleBarsMailTemplateProvider,
)

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(SendGridMailProvider),
)
