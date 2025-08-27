import type { ComparatorRepositoryInterface } from '~/modules/Shared/Domain/ComparatorRepositoryInterface.ts'
import type { SortOrder } from '~/modules/Shared/Domain/Criteria.ts'

const collatorCache = new Map<string, Intl.Collator>()

function getCollator(locale?: string) {
  const key = locale ?? 'default'
  const cached = collatorCache.get(key)

  if (cached) {
    return cached
  }

  const coll = new Intl.Collator(locale, { sensitivity: 'base', numeric: true })

  collatorCache.set(key, coll)

  return coll
}

export class NodeComparatorRepository implements ComparatorRepositoryInterface {
  /**
    * Compare two names in order to decide its order
    *
    * @param aName First name to compare
    * @param bName Seconds name to compare
    * @param order Sort order
    * @param locale Language to compare
    * @return number (-1, 0, 1)
    */
  public nameComparator(aName: string, bName: string, order: SortOrder, locale?: string): number {
    const collator = getCollator(locale)

    const diff = collator.compare(aName, bName)

    return order === 'asc' ? diff : -diff
  }

  /**
     * Compare two numbers in order to decide its order
     *
     * @param aNumber First number to compare
     * @param bNumber Seconds number to compare
     * @param order Sort order
     * @param nulls Nulls order (move nulls to first or last place)
     * @return number (-1, 0, 1)
     */
  public numberComparator(
    aNumber: number | null | undefined,
    bNumber: number | null | undefined,
    order: SortOrder,
    nulls?: 'first'|'last'
  ): number {
    const aNull = aNumber == null
    const bNull = bNumber == null

    if (aNull && bNull) {
      return 0
    }

    if (aNull) {
      return nulls === 'first' ? -1 : 1
    }

    if (bNull) {
      return nulls === 'first' ? 1 : -1
    }

    const diff = (aNumber as number) - (bNumber as number)

    return order === 'asc' ? diff : -diff
  }
}