import type { TeamAppearanceApplicationDto } from './TeamAppearanceApplicationDto.ts'
import type { TeamAppearance } from '~/modules/Team/Domain/TeamAppearance.ts'

export class TeamAppearanceApplicationDtoTranslator {
  public static fromDomain (domain: TeamAppearance): TeamAppearanceApplicationDto {
    return {
      id: domain.id,
      lastWin: domain.lastWin,
      lastSeasonWin: domain.lastSeasonWin,
      titlesCount: domain.titlesCount,
      firstParticipation: domain.firstParticipation,
      currentChampion: domain.currentChampion,
    }
  }
}