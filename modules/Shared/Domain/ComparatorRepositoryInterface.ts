import type { SortOrder } from '~/modules/Shared/Domain/Criteria.ts'

export interface ComparatorRepositoryInterface {
  /**
    * Compare two names in order to decide its order
    *
    * @param aName First name to compare
    * @param bName Seconds name to compare
    * @param order Sort order
    * @param locale Language to compare
    * @return number (-1, 0, 1)
    */
  nameComparator(aName: string, bName: string, order: SortOrder, locale?: string): number

  /**
    * Compare two numbers in order to decide its order
    *
    * @param aNumber First number to compare
    * @param bNumber Seconds number to compare
    * @param order Sort order
    * @param nulls Nulls order (move nulls to first or last place)
    * @return number (-1, 0, 1)
    */
  numberComparator(
    aNumber: number | null | undefined,
    bNumber: number | null | undefined,
    order: SortOrder,
    nulls?: 'first'|'last'
  ): number
}