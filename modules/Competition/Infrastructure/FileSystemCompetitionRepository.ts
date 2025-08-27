import competitions from '~/data/competitions.json'
import countries from '~/data/countries.json'
import translations from '~/data/translations.json'
import type { Competition } from '~/modules/Competition/Domain/Competition.ts'
import type { CompetitionCriteria } from '~/modules/Competition/Domain/CompetitionCriteria.ts'
import type { CompetitionRepositoryInterface } from '~/modules/Competition/Domain/CompetitionRepositoryInterface.ts'
import { CompetitionModelTranslator } from '~/modules/Competition/Infrastructure/CompetititonModelTranslator.ts'
import type { CountryRawModel } from '~/modules/Country/Infrastructure/RawModels/CountryRawModel.ts'
import type { ComparatorRepositoryInterface } from '~/modules/Shared/Domain/ComparatorRepositoryInterface.ts'
import type { Page } from '~/modules/Shared/Domain/Page.ts'
import { TranslationType } from '~/modules/Translation/Domain/Translation.ts'

type TranslationRaw = typeof translations[number]
const countryTranslationsIdx = new Map<string, TranslationRaw[]>()

for (const tr of translations) {
  if (tr.type !== TranslationType.COUNTRY) continue
  const arr = countryTranslationsIdx.get(tr.translatableId)

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  arr ? arr.push(tr) : countryTranslationsIdx.set(tr.translatableId, [ tr ])
}

const competitionCountriesIdx = new Map<string, CountryRawModel>()

for (const c of countries) {
  competitionCountriesIdx.set(c.id, { ...c, translations: countryTranslationsIdx.get(c.id) ?? [] })
}

export class FileSystemCompetitionRepository implements CompetitionRepositoryInterface {
  constructor(private readonly comparatorRepository: ComparatorRepositoryInterface) {
  }

  /**
    * Get a list of competitions given some pagination and filter parameters
    * @param criteria Competition Criteria
    * @return Competitions page
    */
  public async getCompetitions (criteria: CompetitionCriteria): Promise<Page<Competition>> {
    const { pagination: { offset, limit }, sort, locale } = criteria

    const rows = [ ...competitions ]

    rows.sort((a, b) => {
      if (sort.by === 'name') {
        const byName = this.comparatorRepository.nameComparator(a.name, b.name, sort.order, locale)

        if (byName !== 0) {
          return byName
        }

        return this.comparatorRepository.numberComparator(a.relevance, b.relevance, 'desc')
      } else {
        const byRelevance = this.comparatorRepository.numberComparator(a.relevance, b.relevance, sort.order)

        if (byRelevance !== 0) {
          return byRelevance
        }

        return this.comparatorRepository.nameComparator(a.name, b.name, 'asc', locale)
      }
    })
    const slice = rows.slice(offset, offset + limit)

    const items: Array<Competition> = slice.map(competition => {
      return CompetitionModelTranslator.toDomain({
        ...competition,
        country: competitionCountriesIdx.get(competition.countryId)
      }, [ 'country' ])
    })

    const totalItems = rows.length
    const page = Math.floor(offset / limit) + 1
    const pageCount = Math.max(1, Math.ceil(totalItems / limit))
    const hasNext = offset + limit < totalItems
    const hasPrev = offset > 0

    return { items, totalItems, page, pageSize: limit, pageCount, hasNext, hasPrev }
  }
}