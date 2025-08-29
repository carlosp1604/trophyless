import type { CountryRawModel } from '~/modules/Country/Infrastructure/RawModels/CountryRawModel.ts'
import type { TeamRawModel } from '~/modules/Team/Infrastructure/RawModels/TeamRawModel.ts'

export interface CompetitionRawModel {
  id: string
  name: string
  type: string
  imageUrl: string
  countryId: string
  country: CountryRawModel | undefined
  currentChampion: TeamRawModel | undefined
}