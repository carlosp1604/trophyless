import type { TranslationApplicationDto } from '~/modules/Translation/Application/TranslationApplicationDto.ts'

export class TranslationApplicationDtoTranslator {
  public static fromDomain (domain: TranslationApplicationDto): TranslationApplicationDto {
    return {
      field: domain.field,
      value: domain.value,
      language: domain.language,
    }
  }
}