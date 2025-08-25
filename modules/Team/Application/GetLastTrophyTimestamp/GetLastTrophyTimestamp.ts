import type { Result } from '~/modules/Shared/Domain/Result.ts'
import {
  GetLastTrophyTimestampApplicationError
} from '~/modules/Team/Application/GetLastTrophyTimestamp/GetLastTrophyTimestampApplicationError.ts'
import type {
  GetLastTrophyTimestampApplicationRequestDto
} from '~/modules/Team/Application/GetLastTrophyTimestamp/GetLastTrophyTimestampApplicationRequestDto.ts'
import type { TeamRepositoryInterface } from '~/modules/Team/Domain/TeamRepositoryInterface.ts'

export class GetLastTrophyTimestamp {
  constructor(
    private readonly teamRepository: TeamRepositoryInterface
  ) {
  }

  public async get (
    request: GetLastTrophyTimestampApplicationRequestDto
  ): Promise<Result<number, GetLastTrophyTimestampApplicationError>> {
    const timeWithoutTrophy = await this.teamRepository.getTimeWithoutTrophy(request.teamId, request.competitionId)

    if (!timeWithoutTrophy) {
      return {
        success: false,
        error: GetLastTrophyTimestampApplicationError.teamAppearanceNotFound(request.teamId, request.competitionId)
      }
    }

    return {
      success: true,
      value: timeWithoutTrophy
    }
  }
}