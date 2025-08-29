import { Competition } from '~/modules/Competition/Domain/Competition.ts'
import type { CompetitionRepositoryOptions } from '~/modules/Competition/Domain/CompetitionRepositoryInterface.ts'
import type { CompetitionRawModel } from '~/modules/Competition/Infrastructure/CompetitionRawModel.ts'
import { Country } from '~/modules/Country/Domain/Country.ts'
import { CountryModelTranslator } from '~/modules/Country/Infrastructure/CountryModelTranslator.ts'
import { Relationship } from '~/modules/Shared/Domain/Relationship.ts'
import type { Team } from '~/modules/Team/Domain/Team.ts'
import { TeamModelTranslator } from '~/modules/Team/Infrastructure/TeamModelTranslator.ts'

export class CompetitionModelTranslator {
  public static toDomain(rawModel: CompetitionRawModel, options: Array<CompetitionRepositoryOptions>): Competition {
    let countryRelationship: Relationship<Country> = Relationship.notLoaded()
    let currentChampionRelationship: Relationship<Team> = Relationship.notLoaded()

    if (options.includes('country')) {
      if (rawModel.country) {
        const domainModel = CountryModelTranslator.toDomain(rawModel.country)

        countryRelationship = Relationship.initializeRelation(domainModel)
      }
    }

    if (options.includes('currentChampion') && rawModel.currentChampion) {
      const domainModel = TeamModelTranslator.toDomain(rawModel.currentChampion,  [ 'country' ])

      currentChampionRelationship = Relationship.initializeRelation(domainModel)
    }

    return new Competition(
      rawModel.id,
      rawModel.name,
      rawModel.type,
      rawModel.imageUrl,
      rawModel.countryId,
      countryRelationship,
      currentChampionRelationship
    )
  }
}