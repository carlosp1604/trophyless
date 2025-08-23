import type { TeamAppearanceRawModel } from './RawModels/TeamAppearanceRawModel.ts'
import { TeamAppearance } from '~/modules/Team/Domain/TeamAppearance.ts'

export class TeamAppearanceModelTranslator {
  public static toDomain (rawModel: TeamAppearanceRawModel): TeamAppearance {
    return new TeamAppearance(
      rawModel.id,
      rawModel.teamId,
      rawModel.competitionId,
      rawModel.lastWin,
      rawModel.lastSeasonWin,
      rawModel.currentChampion,
      rawModel.firstParticipation,
      rawModel.titlesCount
    )
  }
}