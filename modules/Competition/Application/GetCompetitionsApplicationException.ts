import { ApplicationException } from '~/modules/Exception/Application/ApplicationException.ts'

export class GetCompetitionsApplicationException extends ApplicationException {
  public static invalidPageNumberValueId = 'get_competitions_invalid_page_number_value'
  public static invalidPageSizeValueId = 'get_competitions_invalid_page_size_value'

  public static invalidPageNumber (message: string): GetCompetitionsApplicationException {
    return new GetCompetitionsApplicationException(
      message,
      this.invalidPageNumberValueId
    )
  }

  public static invalidPageSize (message: string): GetCompetitionsApplicationException {
    return new GetCompetitionsApplicationException(
      message,
      this.invalidPageSizeValueId
    )
  }
}
