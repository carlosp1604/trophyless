import type { TeamAppearanceRawModel } from './RawModels/TeamAppearanceRawModel.ts'
import type { TeamRawModel } from './RawModels/TeamRawModel.ts'
import { TeamModelTranslator } from './TeamModelTranslator.ts'
import countries from '~/data/countries.json'
import appearances from '~/data/teamAppearances.json'
import teams from '~/data/teams.json'
import translations from '~/data/translations.json'
import type { CountryRawModel } from '~/modules/Country/Infrastructure/RawModels/CountryRawModel.ts'
import type { ComparatorRepositoryInterface } from '~/modules/Shared/Domain/ComparatorRepositoryInterface.ts'
import type { Page } from '~/modules/Shared/Domain/Page.ts'
import type { Team } from '~/modules/Team/Domain/Team.ts'
import type {
  TeamRepositoryInterface
} from '~/modules/Team/Domain/TeamRepositoryInterface.ts'
import type { TeamsCriteria, TeamSortOrder } from '~/modules/Team/Domain/TeamsCriteria.ts'
import { TranslationType } from '~/modules/Translation/Domain/Translation.ts'

const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true })

const teamAppearancesIdx = new Map<string, TeamAppearanceRawModel[]>()

for (const app of appearances) {
  const list = teamAppearancesIdx.get(app.teamId)

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  list ? list.push(app) : teamAppearancesIdx.set(app.teamId, [ app ])
}

const teamLastWin = new Map<string, number | null>()

for (const team of teams) {
  const teamApps = teamAppearancesIdx.get(team.id) ?? []

  if (teamApps.length === 0) {
    teamLastWin.set(team.id, null)
    continue
  }

  const sorted = [ ...teamApps ].sort((a, b) => {
    const aLastWin = a.lastWin, B = b.lastWin

    if (aLastWin == null && B == null) return 0
    if (aLastWin == null) return 1
    if (B == null) return -1

    return B - aLastWin
  })

  teamLastWin.set(team.id, sorted[0]?.lastWin ?? null)
}

type TranslationRaw = typeof translations[number]
const countryTranslationsIdx = new Map<string, TranslationRaw[]>()

for (const tr of translations) {
  if (tr.type !== TranslationType.COUNTRY) continue
  const arr = countryTranslationsIdx.get(tr.translatableId)

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  arr ? arr.push(tr) : countryTranslationsIdx.set(tr.translatableId, [ tr ])
}

const teamCountriesIdx = new Map<string, CountryRawModel>()

for (const c of countries) {
  teamCountriesIdx.set(c.id, { ...c, translations: countryTranslationsIdx.get(c.id) ?? [] })
}

const teamsById = new Map<string, TeamRawModel>()

for (const t of teams) {
  teamsById.set(t.id, {
    ...t,
    appearances: teamAppearancesIdx.get(t.id) ?? [],
    country: teamCountriesIdx.get(t.countryId)
  })
}

export class FileSystemTeamRepository implements TeamRepositoryInterface {
  constructor(private readonly comparatorRepository: ComparatorRepositoryInterface) {
  }

  /**
   * Get a Team given its ID
   * @param teamId Team ID
   * @return Team if found or null
   */
  public async getTeam (teamId: string): Promise<Team | null> {
    const team = teamsById.get(teamId)

    if (!team) {
      return null
    }

    const teamAppearances: Array<TeamAppearanceRawModel> = appearances.filter((appearance) => appearance.teamId === team.id )
    const country = countries.find((country) => country.id === team.countryId)

    let teamCountry: CountryRawModel | undefined

    if (country) {
      teamCountry = {
        ...country,
        translations: translations.filter((translation) =>
          translation.translatableId === team.countryId && translation.type === TranslationType.COUNTRY)
      }       
    }
    const teamRawModel: TeamRawModel = {
      ...team,
      appearances: teamAppearances,
      country: teamCountry,
    }

    return TeamModelTranslator.toDomain(teamRawModel, [ 'appearances', 'country' ])
  }

  /**
    * Get a list of teams given a TeamsPage
    * @param criteria Team Criteria
    * @return Teams page
    */
  public async getTeams (criteria: TeamsCriteria): Promise<Page<Team>> {
    const { pagination: { offset, limit }, sort, countryId, competitionId, locale } = criteria

    let rows = [ ...teams ]

    if (countryId && countryId !== '') {
      rows = rows.filter(t => t.countryId === countryId)
    }

    if (competitionId && competitionId !== '') {
      rows = rows.filter(t => (teamAppearancesIdx.get(t.id) ?? []).some(a => a.competitionId === competitionId))
    }

    rows.sort((a, b) => {
      if (sort.by === 'lastWin') {
        const byLast = this.lastWinComparator(a.id, b.id, sort.order)

        if (byLast !== 0) {
          return byLast
        }

        const byName = this.comparatorRepository.nameComparator(a.name, b.name, 'asc', locale)

        if (byName !== 0) {
          return byName
        }

        return collator.compare(a.id, b.id)
      } else {
        const byName = this.comparatorRepository.nameComparator(a.name, b.name, sort.order, locale)

        if (byName !== 0) {
          return byName
        }

        const byLast = this.lastWinComparator(a.id, b.id, 'desc')

        if (byLast !== 0) {
          return byLast
        }

        return collator.compare(a.id, b.id)
      }
    })

    const page = rows.slice(offset, offset + limit)

    const processed = page.map(team => ({
      ...team,
      appearances: teamAppearancesIdx.get(team.id) ?? [],
      country: teamCountriesIdx.get(team.countryId)
    }))

    const pageNumber = Math.floor(offset / limit) + 1
    const pageCount = Math.max(1, Math.ceil(rows.length / limit))
    const hasNext = offset + limit < rows.length
    const hasPrev = offset > 0

    return {
      items: processed.map(raw => TeamModelTranslator.toDomain(raw, [ 'appearances','country' ])),
      totalItems: rows.length,
      page: pageNumber,
      pageSize: limit,
      pageCount,
      hasNext,
      hasPrev,
    }
  }

  /**
    * Get the timestamp of the team's most recent win in the given competition.
    * @param teamId Team ID
    * @param competitionId Competition ID
    * @return Timestamp (epoch millis, UTC) of the most recent win, or null if the team has never won this competition.
    */
  public async getLastWinTimestamp (teamId: string, competitionId: string): Promise<number | null> {
    const teamAppearance = appearances.find((appearance) =>
      appearance.teamId === teamId && appearance.competitionId === competitionId
    )

    if (!teamAppearance) {
      return null
    }

    return teamAppearance.lastWin !== null ? teamAppearance.lastWin : teamAppearance.firstParticipation
  }

  /**
    * Get a list of the most popular teams
    * V1 -> Hardcoded team list
    * @return Team array
    */
  public async getPopularTeams (): Promise<Array<Team>> {
    // FIXME: V1 -> Hardcoded team list
    const popularTeamIds: Array<string> = [
      'team-001', 'team-002', 'team-003', 'team-004', 'team-005'
    ]

    const byId = new Map(teams.map(team => [ team.id, team ]))

    const popularTeams = popularTeamIds
      .map(id => byId.get(id))
      .filter((team): team is typeof teams[number] => Boolean(team))

    return popularTeams.map((popularTeam) => {
      const apps = teamAppearancesIdx.get(popularTeam.id) ?? []
      const country = teamCountriesIdx.get(popularTeam.countryId)

      const rawTeam = {
        ...popularTeam,
        appearances: apps,
        country
      }

      return TeamModelTranslator.toDomain(rawTeam, [ 'appearances', 'country' ])
    })
  }

  private lastWinComparator(aId: string, bId: string, order: TeamSortOrder) {
    const aLastWin = teamLastWin.get(aId)
    const bLastWin = teamLastWin.get(bId)

    return this.comparatorRepository.numberComparator(aLastWin, bLastWin, order)
  }
}