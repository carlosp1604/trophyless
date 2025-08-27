import type { TeamApplicationDto } from './TeamApplicationDto.ts'
import { CountryApplicationDtoTranslator } from '~/modules/Country/Application/CountryApplicationDtoTranslator.ts'
import { TeamAppearanceApplicationDtoTranslator } from '~/modules/Team/Application/TeamAppearanceApplicationDtoTranslator.ts'
import type { Team } from '~/modules/Team/Domain/Team.ts'

export class TeamApplicationDtoTranslator {
  public static fromDomain (domain: Team): TeamApplicationDto {
    return {
      id: domain.id,
      name: domain.name,
      imageUrl: domain.imageUrl,
      country: CountryApplicationDtoTranslator.fromDomain(domain.country),
      appearances: domain.appearances.map((appearance) => TeamAppearanceApplicationDtoTranslator.fromDomain(appearance))
    }
  }
}