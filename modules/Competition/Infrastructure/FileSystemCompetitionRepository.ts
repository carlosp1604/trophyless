import competitions from '~/data/competitions.json'
import countries from '~/data/countries.json'
import appearances from '~/data/teamAppearances.json'
import teams from '~/data/teams.json'
import translations from '~/data/translations.json'
import type { Competition } from '~/modules/Competition/Domain/Competition.ts'
import type { CompetitionCriteria } from '~/modules/Competition/Domain/CompetitionCriteria.ts'
import type { CompetitionRepositoryInterface } from '~/modules/Competition/Domain/CompetitionRepositoryInterface.ts'
import { CompetitionModelTranslator } from '~/modules/Competition/Infrastructure/CompetititonModelTranslator.ts'
import type { CountryRawModel } from '~/modules/Country/Infrastructure/RawModels/CountryRawModel.ts'
import type { ComparatorRepositoryInterface } from '~/modules/Shared/Domain/ComparatorRepositoryInterface.ts'
import type { Page } from '~/modules/Shared/Domain/Page.ts'
import type { TeamRawModel } from '~/modules/Team/Infrastructure/RawModels/TeamRawModel.ts'
import { TranslationType } from '~/modules/Translation/Domain/Translation.ts'

type TranslationRaw = typeof translations[number]
const translationsByCountryId = new Map<string, TranslationRaw[]>()

for (const translation of translations) {
  if (translation.type !== TranslationType.COUNTRY) continue
  const list = translationsByCountryId.get(translation.translatableId)

  if (list) list.push(translation)
  else translationsByCountryId.set(translation.translatableId, [ translation ])
}

const countriesById = new Map<string, CountryRawModel>()

for (const country of countries) {
  countriesById.set(country.id, {
    ...country,
    translations: translationsByCountryId.get(country.id) ?? [],
  })
}

const teamsById = new Map<string, TeamRawModel>()

for (const team of teams) {
  teamsById.set(team.id, {
    ...team,
    appearances: undefined,
    country: countriesById.get(team.countryId),
  })
}

type CurrentChampionMeta = { teamId: string; lastWin: number | null }
const currentChampionByCompetitionId = new Map<string, CurrentChampionMeta>()

for (const appearance of appearances) {
  if (!appearance.currentChampion) continue
  const previous = currentChampionByCompetitionId.get(appearance.competitionId)
  const candidateLastWin = appearance.lastWin ?? null

  if (!previous || (previous.lastWin ?? -Infinity) < (candidateLastWin ?? -Infinity)) {
    currentChampionByCompetitionId.set(appearance.competitionId, {
      teamId: appearance.teamId,
      lastWin: candidateLastWin,
    })
  }
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
        country: countriesById.get(competition.countryId),
        currentChampion: undefined
      }, [ 'country' ])
    })

    const totalItems = rows.length
    const page = Math.floor(offset / limit) + 1
    const pageCount = Math.max(1, Math.ceil(totalItems / limit))
    const hasNext = offset + limit < totalItems
    const hasPrev = offset > 0

    return { items, totalItems, page, pageSize: limit, pageCount, hasNext, hasPrev }
  }

  /**
     * Get a Competition given its ID
     * @param competitionId Competition ID
     * @return Competition if found or null
     */
  public async getCompetitionById (competitionId: string): Promise<Competition | null> {
    const rawCompetition = competitions.find(competition => competition.id === competitionId)

    if (!rawCompetition) {
      return null
    }

    const rawCountry = countriesById.get(rawCompetition.countryId)

    const championMeta = currentChampionByCompetitionId.get(rawCompetition.id)
    let rawCurrentChampion: TeamRawModel | undefined = undefined

    if (championMeta) {
      const rawTeam = teamsById.get(championMeta.teamId)

      if (rawTeam) {
        rawCurrentChampion = rawTeam
      }
    }

    return CompetitionModelTranslator.toDomain({
      ...rawCompetition,
      country: rawCountry,
      currentChampion: rawCurrentChampion,
    }, [ 'country', 'currentChampion' ])
  }
}