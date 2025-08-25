import type {
  CompetitionApplicationResponseDto
} from '~/modules/Competition/Application/CompetitionApplicationResponseDto.ts'
import type { Competition } from '~/modules/Competition/Domain/Competition.ts'
import { CountryApplicationDtoTranslator } from '~/modules/Country/Application/CountryApplicationDtoTranslator.ts'

export class CompetitionApplicationResponseDtoTranslator {
  public static fromDomain(domain: Competition): CompetitionApplicationResponseDto {
    return {
      id: domain.id,
      name: domain.name,
      imageUrl: domain.imageUrl,
      country: CountryApplicationDtoTranslator.fromDomain(domain.country),
      type: domain.type,
      countryId: domain.countryId,
    }
  }
}