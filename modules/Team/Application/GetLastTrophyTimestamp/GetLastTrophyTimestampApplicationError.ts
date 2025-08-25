import { ApplicationError } from '~/modules/Error/Application/ApplicationError.ts'

export class GetLastTrophyTimestampApplicationError extends ApplicationError {
  public static teamAppearanceNotFoundId = 'get_time_without_trophy_application_error'

  public static teamAppearanceNotFound(teamId: string, competitionId: string): GetLastTrophyTimestampApplicationError {
    return new GetLastTrophyTimestampApplicationError(
      `Team appearance for team ${teamId} and ${competitionId} was not found`,
      this.teamAppearanceNotFoundId
    )
  }
}