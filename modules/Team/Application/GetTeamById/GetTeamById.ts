import { GetTeamByIdApplicationError } from './GetTeamByIdApplicationError.ts'
import type { TeamApplicationResponseDto } from '../TeamApplicationResponseDto.ts'
import { TeamApplicationResponseDtoTranslator } from '../TeamApplicationResponseDtoTranslator.ts'
import type { Result } from '~/modules/Shared/Domain/Result.ts'
import type { TeamRepositoryInterface } from '~/modules/Team/Domain/TeamRepositoryInterface.ts'

export class GetTeamById {
  constructor(private readonly teamRepository: TeamRepositoryInterface) {
  }

  public async get (teamId: string): Promise<Result<TeamApplicationResponseDto, GetTeamByIdApplicationError>> {
    const team = await this.teamRepository.getTeam(teamId)

    if (!team) {
      return { success: false, error: GetTeamByIdApplicationError.teamNotFound(teamId) }
    }

    return { success: true, value: TeamApplicationResponseDtoTranslator.fromDomain(team) }
  }
}