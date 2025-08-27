export type CompetitionSortBy = 'name' | 'relevance'
export type SortOrder = 'asc' | 'desc'

export class Pagination {
  private constructor(public readonly offset: number, public readonly limit: number) {
  }
  static fromPage(page?: number, size?: number) {
    const validatePage = Math.max(1, Math.floor(page ?? 1))
    const validatedPageSize = Math.max(1, Math.floor(size ?? 10))

    return new Pagination((validatePage - 1) * validatedPageSize, validatedPageSize)
  }
}

export class Sort {
  private constructor(public readonly by: CompetitionSortBy, public readonly order: SortOrder) {
  }
  static create(by?: unknown, order?: unknown) {
    const validatedSortBy: CompetitionSortBy = by === 'name' ? 'name' : 'relevance'
    const validatedSortOrder: SortOrder = order === 'desc' ? 'desc' : 'asc'

    return new Sort(validatedSortBy, validatedSortOrder)
  }
}

export class CompetitionCriteria {
  private constructor(
    public readonly pagination: Pagination,
    public readonly sort: Sort,
    public readonly locale?: string,
  ) {
  }
  static create(args: {
    page?: number
    size?: number
    sortBy?: unknown
    sortOrder?: unknown
    locale?: string
  }) {
    return new CompetitionCriteria(
      Pagination.fromPage(args.page, args.size),
      Sort.create(args.sortBy, args.sortOrder),
      args.locale
    )
  }
}