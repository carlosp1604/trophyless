import { ApplicationError } from '~/modules/Error/Application/ApplicationError.ts'

export class GetTeamByIdApplicationError extends ApplicationError {
  public static teamNotFoundId = 'get_team_by_id_team_not_found'

  private constructor (message: string, id: string) {
    super(message, id)
  }


  public static teamNotFound (teamId: string): GetTeamByIdApplicationError {
    return new GetTeamByIdApplicationError(
      `Team with ID ${teamId} was not found`,
      this.teamNotFoundId
    )
  }
}