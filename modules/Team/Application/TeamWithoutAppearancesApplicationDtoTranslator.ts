import { CountryApplicationDtoTranslator } from '~/modules/Country/Application/CountryApplicationDtoTranslator.ts'
import type {
  TeamWithoutAppearancesApplicationDto
} from '~/modules/Team/Application/TeamWithoutAppearancesApplicationDto.ts'
import type { Team } from '~/modules/Team/Domain/Team.ts'

export class TeamWithoutAppearancesApplicationDtoTranslator {
  public static fromDomain (domain: Team): TeamWithoutAppearancesApplicationDto {
    return {
      id: domain.id,
      name: domain.name,
      imageUrl: domain.imageUrl,
      country: CountryApplicationDtoTranslator.fromDomain(domain.country),
    }
  }
}