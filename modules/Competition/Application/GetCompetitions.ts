import {
  CompetitionApplicationDtoTranslator
} from '~/modules/Competition/Application/CompetitionApplicationDtoTranslator.ts'
import type {
  GetCompetitionsApplicationException
} from '~/modules/Competition/Application/GetCompetitionsApplicationException.ts'
import type {
  GetCompetitionsApplicationRequestDto
} from '~/modules/Competition/Application/GetCompetitionsApplicationRequestDto.ts'
import type {
  GetCompetitionsApplicationResponseDto
} from '~/modules/Competition/Application/GetCompetitionsApplicationResponseDto.ts'
import { CompetitionCriteria } from '~/modules/Competition/Domain/CompetitionCriteria.ts'
import type { CompetitionRepositoryInterface } from '~/modules/Competition/Domain/CompetitionRepositoryInterface.ts'
import type { Result } from '~/modules/Shared/Domain/Result.ts'

export class GetCompetitions {
  constructor(
    private readonly competitionRepository: CompetitionRepositoryInterface,
  ) {
  }

  public async get(
    request: GetCompetitionsApplicationRequestDto
  ): Promise<Result<GetCompetitionsApplicationResponseDto, GetCompetitionsApplicationException>> {

    const criteria = CompetitionCriteria.create({
      page: request.pageNumber,
      size: request.pageSize,
      sortBy: request.sortOrder,
      sortOrder: request.sortOrder,
      locale: request.locale,
    })

    const competitionsPage = await this.competitionRepository.getCompetitions(criteria)

    return {
      success: true,
      value: {
        competitions: competitionsPage.items.map((competition) => CompetitionApplicationDtoTranslator.fromDomain(competition)),
        totalItems: competitionsPage.totalItems,
        page: competitionsPage.page,
        pageSize: competitionsPage.pageSize,
        pageCount: competitionsPage.pageCount,
        hasNext: competitionsPage.hasNext,
        hasPrev: competitionsPage.hasPrev,
      }
    }
  }
}