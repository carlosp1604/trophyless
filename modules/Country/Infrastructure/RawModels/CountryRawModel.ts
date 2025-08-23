import type { TranslationRawModel } from '~/modules/Translation/Infrastructure/TranslationRawModel.ts'

export interface CountryRawModel {
  id: string
  name: string
  imageUrl: string
  translations: Array<TranslationRawModel>
}