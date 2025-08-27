import type { TeamApplicationDto } from '~/modules/Team/Application/TeamApplicationDto.ts'

export interface GetTeamsApplicationResponseDto {
  teams: Array<TeamApplicationDto>
  totalItems: number
  page: number
  pageSize: number
  pageCount: number
  hasNext: boolean
  hasPrev: boolean
}