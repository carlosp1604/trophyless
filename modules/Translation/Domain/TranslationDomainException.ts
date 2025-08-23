import { DomainException } from '~/modules/Exception/Domain/DomainException.ts'

export class TranslationDomainException extends DomainException {
  public static invalidTypeId = 'translation_invalid_type'
  public static invalidFieldId = 'translation_invalid_field_id'

  public static invalidType (type: string): TranslationDomainException {
    return new TranslationDomainException(
      `Type ${type} is not a valid translation type`,
      this.invalidTypeId
    )
  }

  public static invalidField (): TranslationDomainException {
    return new TranslationDomainException(
      'Field cannot be empty',
      this.invalidFieldId
    )
  }
}