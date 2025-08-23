import type { TeamAppearanceRawModel } from './RawModels/TeamAppearanceRawModel.ts'
import type { TeamRawModel } from './RawModels/TeamRawModel.ts'
import { TeamModelTranslator } from './TeamModelTranslator.ts'
import countries from '~/data/countries.json'
import appearances from '~/data/teamAppearances.json'
import teams from '~/data/teams.json'
import translations from '~/data/translations.json'
import type { CountryRawModel } from '~/modules/Country/Infrastructure/RawModels/CountryRawModel.ts'
import type { Team } from '~/modules/Team/Domain/Team.ts'
import type { TeamRepositoryInterface } from '~/modules/Team/Domain/TeamRepositoryInterface.ts'
import { TranslationType } from '~/modules/Translation/Domain/Translation.ts'

export class FileSystemTeamRepository implements TeamRepositoryInterface {
  /**
   * Get a Team given its ID
   * @param teamId Team ID
   * @return Team if found or null
   */
  public async getTeam (teamId: string): Promise<Team | null> {
    const team = teams.find((team) => team.id === teamId)

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
    * Get a list of teams given some pagination and filter parameters
    * @param offset Pagination offset
    * @param limit Pagination limit
    * @return Team array
    */
  public async getTeams (offset: number, limit: number): Promise<Array<Team>> {
    const safeOffset = Math.max(0, Math.floor(offset ?? 0))
    const safeLimit = Math.max(0, Math.floor(limit ?? 0))

    if (safeLimit === 0) {
      return []
    }

    const teamAppearances: Map<TeamAppearanceRawModel['teamId'], Array<TeamAppearanceRawModel>> = new Map()
    const teamCountries: Map<CountryRawModel['id'], CountryRawModel> = new Map()

    for (const app of appearances) {
      const key = app.teamId
      const list = teamAppearances.get(key)

      if (list) {
        list.push(app)
      } else {
        teamAppearances.set(key, [ app ])
      }
    }


    console.log(teamAppearances)


    countries.forEach(country => {
      const teamCountry = {
        ...country,
        translations: translations.filter((translation) =>
          translation.translatableId === country.id && translation.type === TranslationType.COUNTRY)
      }

      teamCountries.set(country.id, teamCountry)
    })


    const total = teams.length

    if (safeOffset >= total) return []

    const end = Math.min(total, safeOffset + safeLimit)
    const page = teams.slice(safeOffset, end)

    const processedPage = page.map((team) => {
      const apps = teamAppearances.get(team.id) ?? []
      const country = teamCountries.get(team.countryId)

      return {
        ...team,
        appearances: apps,
        country
      }
    })

    return processedPage.map((raw) =>
      TeamModelTranslator.toDomain(raw, [ 'appearances', 'country' ])
    )
  }
}