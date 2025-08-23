import type { CountryRawModel } from '~/modules/Country/Infrastructure/RawModels/CountryRawModel.ts'
import type { TeamAppearanceRawModel } from '~/modules/Team/Infrastructure/RawModels/TeamAppearanceRawModel.ts'

export interface TeamRawModel {
  id: string
  name: string
  imageUrl: string
  countryId: string
  appearances: Array<TeamAppearanceRawModel> | undefined
  country: CountryRawModel | undefined
}