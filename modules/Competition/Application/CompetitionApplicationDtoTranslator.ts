import type {
  CompetitionApplicationDto
} from '~/modules/Competition/Application/CompetitionApplicationDto.ts'
import type { Competition } from '~/modules/Competition/Domain/Competition.ts'
import { CountryApplicationDtoTranslator } from '~/modules/Country/Application/CountryApplicationDtoTranslator.ts'

export class CompetitionApplicationDtoTranslator {
  public static fromDomain(domain: Competition): CompetitionApplicationDto {
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