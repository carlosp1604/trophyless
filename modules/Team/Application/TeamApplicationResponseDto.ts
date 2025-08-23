import type { CountryApplicationDto } from '~/modules/Country/Application/CountryApplicationDto.ts'
import type { TeamAppearanceApplicationDto } from '~/modules/Team/Application/TeamAppearanceApplicationDto.ts'

export interface TeamApplicationResponseDto {
  id: string
  name: string
  imageUrl: string
  appearances: Array<TeamAppearanceApplicationDto>
  country: CountryApplicationDto
}