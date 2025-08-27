export interface GetTeamsApplicationRequestDto {
  pageNumber: number
  pageSize: number
  sortOption: string
  sortOrder: string
  locale: string
  competitionId: string | undefined
  countryId: string | undefined
}