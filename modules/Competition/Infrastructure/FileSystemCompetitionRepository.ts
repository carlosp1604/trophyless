import competitions from '~/data/competitions.json'
import countries from '~/data/countries.json'
import translations from '~/data/translations.json'
import type { Competition } from '~/modules/Competition/Domain/Competition.ts'
import type { CompetitionRepositoryInterface } from '~/modules/Competition/Domain/CompetitionRepositoryInterface.ts'
import { CompetitionModelTranslator } from '~/modules/Competition/Infrastructure/CompetititonModelTranslator.ts'
import type { CountryRawModel    } from '~/modules/Country/Infrastructure/RawModels/CountryRawModel.ts'
import { TranslationType } from '~/modules/Translation/Domain/Translation.ts'

export class FileSystemCompetitionRepository implements CompetitionRepositoryInterface {
  /**
     * Get a list of competitions given some pagination and filter parameters
     * @param offset Pagination offset
     * @param limit Pagination limit
     * @return Competition array
     */
  public async getCompetitions (offset: number, limit: number): Promise<Array<Competition>> {
    const safeOffset = Math.max(0, Math.floor(offset ?? 0))
    const safeLimit = Math.max(0, Math.floor(limit ?? 0))

    if (safeLimit === 0) {
      return []
    }

    const competitionCountries: Map<CountryRawModel['id'], CountryRawModel> = new Map()


    countries.forEach(country => {
      const teamCountry = {
        ...country,
        translations: translations.filter((translation) =>
          translation.translatableId === country.id && translation.type === TranslationType.COUNTRY)
      }

      competitionCountries.set(country.id, teamCountry)
    })


    const total = competitions.length

    if (safeOffset >= total) {
      return []
    }

    const end = Math.min(total, safeOffset + safeLimit)
    const page = competitions.slice(safeOffset, end)

    const processedPage = page.map((competition) => {
      const country = competitionCountries.get(competition.countryId)

      return {
        ...competition,
        country
      }
    })

    return processedPage.map((raw) =>
      CompetitionModelTranslator.toDomain(raw, [ 'country' ])
    )
  }
}