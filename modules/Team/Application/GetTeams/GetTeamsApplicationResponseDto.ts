import type { TeamApplicationResponseDto } from '~/modules/Team/Application/TeamApplicationResponseDto.ts'

export interface GetTeamsApplicationResponseDto {
  teams: Array<TeamApplicationResponseDto>
  totalItems: number
  page: number
  pageSize: number
  pageCount: number
  hasNext: boolean
  hasPrev: boolean
}