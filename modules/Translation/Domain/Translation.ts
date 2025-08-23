import { TranslationDomainException } from '~/modules/Translation/Domain/TranslationDomainException.ts'

export enum TranslationType {
  COUNTRY = 'Country',
}

export class Translation {
  public readonly type: TranslationType
  public readonly translatableId: string
  public readonly field: string
  public readonly language: string
  public readonly value: string

  constructor(
    type: string,
    translatableId: string,
    field: string,
    language: string,
    value: string,
  ) {
    this.type = this.parseTranslationType(type)
    this.translatableId = translatableId
    this.language = language
    this.value = value

    if (!field) {
      throw TranslationDomainException.invalidField()
    }

    this.field = field
  }

  private parseTranslationType (type: string): TranslationType {
    if ((Object.values(TranslationType) as Array<string>).includes(type)) {
      return type as TranslationType
    }

    throw TranslationDomainException.invalidType(type)
  }
}