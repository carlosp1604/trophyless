import type { CountryApplicationDto } from './CountryApplicationDto.ts'
import type { Country } from '~/modules/Country/Domain/Country.ts'
import {
  TranslationApplicationDtoTranslator
} from '~/modules/Translation/Application/TranslationApplicationDtoTranslator.ts'

export class CountryApplicationDtoTranslator {
  public static fromDomain (domain: Country): CountryApplicationDto {
    return {
      id: domain.id,
      name: domain.name,
      imageUrl: domain.imageUrl,
      translations: domain.translations.map((translation) => TranslationApplicationDtoTranslator.fromDomain(translation))
    }
  }
}