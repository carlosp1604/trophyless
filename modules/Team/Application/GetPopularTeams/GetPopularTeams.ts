import type { Result } from '~/modules/Shared/Domain/Result.ts'
import type { TeamApplicationDto } from '~/modules/Team/Application/TeamApplicationDto.ts'
import { TeamApplicationDtoTranslator } from '~/modules/Team/Application/TeamApplicationDtoTranslator.ts'
import type { TeamRepositoryInterface } from '~/modules/Team/Domain/TeamRepositoryInterface.ts'

export class GetPopularTeams {
  constructor(
    private readonly teamRepository: TeamRepositoryInterface
  ) {
  }

  public async get (): Promise<Result<Array<TeamApplicationDto>, never>> {
    const popularTeams = await this.teamRepository.getPopularTeams()

    return {
      success: true,
      value: popularTeams.map((popularTeam) => TeamApplicationDtoTranslator.fromDomain(popularTeam))
    }
  }
}