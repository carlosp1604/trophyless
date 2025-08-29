import { ApplicationError } from '~/modules/Error/Application/ApplicationError.ts'

export class GetCompetitionByIdApplicationError extends ApplicationError {
  public static competitionNotFoundId = 'get_competition_by_id_competition_not_found'

  private constructor (message: string, id: string) {
    super(message, id)
  }


  public static competitionNotFound (competitionId: string): GetCompetitionByIdApplicationError {
    return new GetCompetitionByIdApplicationError(
      `Competition with ID ${competitionId} was not found`,
      this.competitionNotFoundId
    )
  }
}