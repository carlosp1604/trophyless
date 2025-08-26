import type { Result } from '~/modules/Shared/Domain/Result.ts'
import { GetTeamsApplicationException } from '~/modules/Team/Application/GetTeams/GetTeamsApplicationException.ts'
import type { GetTeamsApplicationRequestDto } from '~/modules/Team/Application/GetTeams/GetTeamsApplicationRequestDto.ts'
import type { GetTeamsApplicationResponseDto } from '~/modules/Team/Application/GetTeams/GetTeamsApplicationResponseDto.ts'
import { TeamApplicationResponseDtoTranslator } from '~/modules/Team/Application/TeamApplicationResponseDtoTranslator.ts'
import type { TeamRepositoryInterface } from '~/modules/Team/Domain/TeamRepositoryInterface.ts'
import { TeamsPage } from '~/modules/Team/Domain/TeamsPage.ts'

export class GetTeams {
  constructor(
    private readonly teamRepository: TeamRepositoryInterface,
  ) {
  }

  public async get(
    request: GetTeamsApplicationRequestDto
  ): Promise<Result<GetTeamsApplicationResponseDto, GetTeamsApplicationException>> {
    const criteria = TeamsPage.create({
      page: request.pageNumber,
      size: request.pageSize,
      sortBy: request.sortOption,
      sortOrder: request.sortOrder,
    })

    const teamsPage = await this.teamRepository.getTeams(criteria)

    return {
      success: true,
      value: {
        teams: teamsPage.items.map((team) => TeamApplicationResponseDtoTranslator.fromDomain(team)),
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