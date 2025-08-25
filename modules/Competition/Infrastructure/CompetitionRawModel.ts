import type { CountryRawModel } from '~/modules/Country/Infrastructure/RawModels/CountryRawModel.ts'

export interface CompetitionRawModel {
  id: string
  name: string
  type: string
  imageUrl: string
  countryId: string
  country: CountryRawModel | undefined
}