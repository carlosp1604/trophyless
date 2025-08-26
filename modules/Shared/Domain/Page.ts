export interface Page<T> {
  items: T[]
  totalItems: number
  page: number
  pageSize: number
  pageCount: number
  hasNext: boolean
  hasPrev: boolean
}
