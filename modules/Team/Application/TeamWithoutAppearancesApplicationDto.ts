import type { CountryApplicationDto } from '~/modules/Country/Application/CountryApplicationDto.ts'

export interface TeamWithoutAppearancesApplicationDto {
  id: string
  name: string
  imageUrl: string
  country: CountryApplicationDto
}