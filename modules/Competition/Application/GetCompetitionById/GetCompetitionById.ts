import { GetCompetitionByIdApplicationError } from './GetCompetitionByIdApplicationError.ts'
import {
  CompetitionApplicationDtoTranslator
} from '~/modules/Competition/Application/CompetitionApplicationDtoTranslator.ts'
import type {
  GetCompetitionByIdApplicationResponseDto
} from '~/modules/Competition/Application/GetCompetitionById/GetCompetitionByIdApplicationResponseDto.ts'
import type { CompetitionRepositoryInterface } from '~/modules/Competition/Domain/CompetitionRepositoryInterface.ts'
import type { Result } from '~/modules/Shared/Domain/Result.ts'
import {
  TeamWithoutAppearancesApplicationDtoTranslator
} from '~/modules/Team/Application/TeamWithoutAppearancesApplicationDtoTranslator.ts'

export class GetCompetitionById {
  constructor(private readonly competitionRepository: CompetitionRepositoryInterface) {
  }

  public async get (
    competitionId: string
  ): Promise<Result<GetCompetitionByIdApplicationResponseDto, GetCompetitionByIdApplicationError>> {
    const competition = await this.competitionRepository.getCompetitionById(competitionId)

    if (!competition) {
      return { success: false, error: GetCompetitionByIdApplicationError.competitionNotFound(competitionId) }
    }

    return {
      success: true,
      value: {
        competition: CompetitionApplicationDtoTranslator.fromDomain(competition),
        currentChampion: TeamWithoutAppearancesApplicationDtoTranslator.fromDomain(competition.currentChampion)
      }
    }
  }
}