import type {
  CompetitionApplicationResponseDto
} from '~/modules/Competition/Application/CompetitionApplicationResponseDto.ts'
import {
  CompetitionApplicationResponseDtoTranslator
} from '~/modules/Competition/Application/CompetitionApplicationResponseDtoTranslator.ts'
import type {
  GetCompetitionsApplicationException
} from '~/modules/Competition/Application/GetCompetitionsApplicationException.ts'
import type {
  GetCompetitionsApplicationRequestDto
} from '~/modules/Competition/Application/GetCompetitionsApplicationRequestDto.ts'
import type { CompetitionRepositoryInterface } from '~/modules/Competition/Domain/CompetitionRepositoryInterface.ts'
import type { Result } from '~/modules/Shared/Domain/Result.ts'
import { PageNumberValueObject } from '~/modules/Shared/Domain/ValueObject/PageNumberValueObject.ts'
import { PageSizeValueObject } from '~/modules/Shared/Domain/ValueObject/PageSizeValueObject.ts'
import { ValueObjectException } from '~/modules/Shared/Domain/ValueObject/ValueObjectException.ts'
import { GetTeamsApplicationException } from '~/modules/Team/Application/GetTeams/GetTeamsApplicationException.ts'

interface ValidateRequestResult {
  pageSize: PageSizeValueObject
  pageNumber: PageNumberValueObject
}

export class GetCompetitions {
  constructor(
    private readonly competitionRepository: CompetitionRepositoryInterface,
    private readonly minPageSize: number,
    private readonly maxPageSize: number,
    private readonly minPage: number,
    private readonly maxPage: number
  ) {
  }

  public async get(
    request: GetCompetitionsApplicationRequestDto
  ): Promise<Result<Array<CompetitionApplicationResponseDto>, GetCompetitionsApplicationException>> {

    const validateRequestResult = this.validateRequest(request)

    if (!validateRequestResult.success) {
      return validateRequestResult
    }

    const pageNumber = validateRequestResult.value.pageNumber.value
    const pageSize = validateRequestResult.value.pageSize.value

    const offset = (pageNumber - 1) * pageSize

    const competitions = await this.competitionRepository.getCompetitions(offset, pageSize)

    return {
      success: true,
      value: competitions.map((competition) => CompetitionApplicationResponseDtoTranslator.fromDomain(competition))
    }
  }


  private validateRequest (
    request: GetCompetitionsApplicationRequestDto
  ): Result<ValidateRequestResult, GetCompetitionsApplicationException> {
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