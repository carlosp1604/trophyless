import type { CompetitionApplicationDto } from '~/modules/Competition/Application/CompetitionApplicationDto.ts'

export interface GetCompetitionsApplicationResponseDto {
  competitions: Array<CompetitionApplicationDto>
  totalItems: number
  page: number
  pageSize: number
  pageCount: number
  hasNext: boolean
  hasPrev: boolean
}