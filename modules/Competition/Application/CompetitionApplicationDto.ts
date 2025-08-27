import type { CountryApplicationDto } from '~/modules/Country/Application/CountryApplicationDto.ts'

export interface CompetitionApplicationDto {
  id: string
  name: string
  type: string
  imageUrl: string
  countryId: string
  country: CountryApplicationDto
}