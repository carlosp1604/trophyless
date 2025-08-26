import type { Result } from '~/modules/Shared/Domain/Result.ts'
import type { TeamApplicationResponseDto } from '~/modules/Team/Application/TeamApplicationResponseDto.ts'
import { TeamApplicationResponseDtoTranslator } from '~/modules/Team/Application/TeamApplicationResponseDtoTranslator.ts'
import type { TeamRepositoryInterface } from '~/modules/Team/Domain/TeamRepositoryInterface.ts'

export class GetPopularTeams {
  constructor(
    private readonly teamRepository: TeamRepositoryInterface
  ) {
  }

  public async get (): Promise<Result<Array<TeamApplicationResponseDto>, never>> {
    const popularTeams = await this.teamRepository.getPopularTeams()

    return {
      success: true,
      value: popularTeams.map((popularTeam) => TeamApplicationResponseDtoTranslator.fromDomain(popularTeam))
    }
  }
}