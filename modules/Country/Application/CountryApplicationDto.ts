import type { TranslationApplicationDto } from '~/modules/Translation/Application/TranslationApplicationDto.ts'

export interface CountryApplicationDto {
  id: string
  name: string
  imageUrl: string
  translations: Array<TranslationApplicationDto>
}