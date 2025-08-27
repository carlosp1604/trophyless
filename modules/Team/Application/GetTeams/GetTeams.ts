import type { Result } from '~/modules/Shared/Domain/Result.ts'
import type { GetTeamsApplicationRequestDto } from '~/modules/Team/Application/GetTeams/GetTeamsApplicationRequestDto.ts'
import type { GetTeamsApplicationResponseDto } from '~/modules/Team/Application/GetTeams/GetTeamsApplicationResponseDto.ts'
import { TeamApplicationDtoTranslator } from '~/modules/Team/Application/TeamApplicationDtoTranslator.ts'
import type { TeamRepositoryInterface } from '~/modules/Team/Domain/TeamRepositoryInterface.ts'
import { TeamsCriteria } from '~/modules/Team/Domain/TeamsCriteria.ts'

export class GetTeams {
  constructor(
    private readonly teamRepository: TeamRepositoryInterface,
  ) {
  }

  public async get(
    request: GetTeamsApplicationRequestDto
  ): Promise<Result<GetTeamsApplicationResponseDto, never>> {
    const criteria = TeamsCriteria.create({
      page: request.pageNumber,
      size: request.pageSize,
      sortBy: request.sortOption,
      sortOrder: request.sortOrder,
      locale: request.locale,
      competitionId: request.competitionId,
      countryId: request.countryId,
    })

    const teamsPage = await this.teamRepository.getTeams(criteria)

    return {
      success: true,
      value: {
        teams: teamsPage.items.map((team) => TeamApplicationDtoTranslator.fromDomain(team)),
        totalItems: teamsPage.totalItems,
        page: teamsPage.page,
        pageSize: teamsPage.pageSize,
        pageCount: teamsPage.pageCount,
        hasNext: teamsPage.hasNext,
        hasPrev: teamsPage.hasPrev,
      }
    }
  }
}