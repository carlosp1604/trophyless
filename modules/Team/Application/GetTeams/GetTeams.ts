import type { Result } from '~/modules/Shared/Domain/Result.ts'
import { PageNumberValueObject } from '~/modules/Shared/Domain/ValueObject/PageNumberValueObject.ts'
import { PageSizeValueObject } from '~/modules/Shared/Domain/ValueObject/PageSizeValueObject.ts'
import { ValueObjectException } from '~/modules/Shared/Domain/ValueObject/ValueObjectException.ts'
import { GetTeamsApplicationException } from '~/modules/Team/Application/GetTeams/GetTeamsApplicationException.ts'
import type { GetTeamsApplicationRequestDto } from '~/modules/Team/Application/GetTeams/GetTeamsApplicationRequestDto.ts'
import type { TeamApplicationResponseDto } from '~/modules/Team/Application/TeamApplicationResponseDto.ts'
import { TeamApplicationResponseDtoTranslator } from '~/modules/Team/Application/TeamApplicationResponseDtoTranslator.ts'
import type { TeamRepositoryInterface } from '~/modules/Team/Domain/TeamRepositoryInterface.ts'

interface ValidateRequestResult {
  pageSize: PageSizeValueObject
  pageNumber: PageNumberValueObject
}

export class GetTeams {
  constructor(
    private readonly teamRepository: TeamRepositoryInterface,
    private readonly minPageSize: number,
    private readonly maxPageSize: number,
    private readonly minPage: number,
    private readonly maxPage: number
  ) {
  }

  public async get(
    request: GetTeamsApplicationRequestDto
  ): Promise<Result<Array<TeamApplicationResponseDto>, GetTeamsApplicationException>> {

    const validateRequestResult = this.validateRequest(request)

    if (!validateRequestResult.success) {
      return validateRequestResult
    }

    const pageNumber = validateRequestResult.value.pageNumber.value
    const pageSize = validateRequestResult.value.pageSize.value

    const offset = (pageNumber - 1) * pageSize

    const teams = await this.teamRepository.getTeams(offset, pageSize)

    return {
      success: true,
      value: teams.map((team) => TeamApplicationResponseDtoTranslator.fromDomain(team))
    }
  }


  private validateRequest (request: GetTeamsApplicationRequestDto): Result<ValidateRequestResult, GetTeamsApplicationException> {
    try {
      const pageNumberValueObject = PageNumberValueObject.withinBounds(request.pageNumber, this.minPage, this.maxPage)
      const pageSizeValueObject = PageSizeValueObject.withinBounds(request.pageSize, this.minPageSize, this.maxPageSize)

      return {
        success: true,
        value: {
          pageNumber: pageNumberValueObject,
          pageSize: pageSizeValueObject
        }
      }

    } catch (exception: unknown) {
      if (!(exception instanceof ValueObjectException)) {
        throw exception
      }

      if (exception.id === ValueObjectException.invalidPageNumberId) {
        return {
          success: false,
          error: GetTeamsApplicationException.invalidPageNumber(exception.message)
        }
      }

      if (exception.id === ValueObjectException.invalidPageSizeId) {
        return {
          success: false,
          error: GetTeamsApplicationException.invalidPageSize(exception.message)
        }
      }

      throw exception
    }
  }
}