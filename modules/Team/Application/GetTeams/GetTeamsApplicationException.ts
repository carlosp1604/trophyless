import { ApplicationException } from '~/modules/Exception/Application/ApplicationException.ts'

export class GetTeamsApplicationException extends ApplicationException {
  public static invalidPageNumberValueId = 'get_teams_invalid_page_number_value'
  public static invalidPageSizeValueId = 'get_teams_invalid_page_size_value'

  public static invalidPageNumber (message: string): GetTeamsApplicationException {
    return new GetTeamsApplicationException(
      message,
      this.invalidPageNumberValueId
    )
  }

  public static invalidPageSize (message: string): GetTeamsApplicationException {
    return new GetTeamsApplicationException(
      message,
      this.invalidPageSizeValueId
    )
  }
}