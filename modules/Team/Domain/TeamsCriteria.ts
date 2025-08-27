export type TeamSortBy = 'name' | 'lastWin'
export type TeamSortOrder = 'asc' | 'desc'

export class Pagination {
  private constructor(public readonly offset: number, public readonly limit: number) {
  }

  static fromPage(page: number, size: number) {
    const validatedPage = Math.max(1, Math.floor(page))
    const validateSize = Math.max(1, Math.floor(size))

    return new Pagination((validatedPage - 1) * validateSize, validateSize)
  }
}

export class Sort {
  private constructor(public readonly by: TeamSortBy, public readonly order: TeamSortOrder) {
  }

  static create(by?: unknown, order?: unknown) {
    const validateBy: TeamSortBy = by === 'lastWin' ? 'lastWin' : 'name'
    const validatedOrder: TeamSortOrder  = order === 'asc' ? 'asc' : 'desc'

    return new Sort(validateBy, validatedOrder)
  }
}

export class TeamsCriteria {
  private constructor(
    public readonly pagination: Pagination,
    public readonly sort: Sort,
    public readonly countryId?: string,
    public readonly competitionId?: string,
    public readonly locale?: string
  ) {
  }

  static create(args: {
    page: number
    size: number
    sortBy?: unknown
    sortOrder?: unknown
    countryId?: string
    competitionId?: string
    locale?: string
  }) {
    return new TeamsCriteria(
      Pagination.fromPage(args.page, args.size),
      Sort.create(args.sortBy, args.sortOrder),
      args.countryId,
      args.competitionId,
      args.locale,
    )
  }
}
