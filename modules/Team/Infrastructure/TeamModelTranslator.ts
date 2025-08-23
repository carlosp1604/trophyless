import type { TeamRawModel } from './RawModels/TeamRawModel.ts'
import { TeamAppearanceModelTranslator } from './TeamAppearanceModelTranslator.ts'
import { Country } from '~/modules/Country/Domain/Country.ts'
import { CountryModelTranslator } from '~/modules/Country/Infrastructure/CountryModelTranslator.ts'
import { Relationship } from '~/modules/Shared/Domain/Relationship.ts'
import { RelationshipCollection } from '~/modules/Shared/Domain/RelationshipCollection.ts'
import { Team } from '~/modules/Team/Domain/Team.ts'
import { TeamAppearance } from '~/modules/Team/Domain/TeamAppearance.ts'
import type { TeamRepositoryOptions } from '~/modules/Team/Domain/TeamRepositoryInterface.ts'

export class TeamModelTranslator {
  public static toDomain (rawModel: TeamRawModel, options: Array<TeamRepositoryOptions>): Team {
    let appearancesCollection: RelationshipCollection<TeamAppearance, TeamAppearance['id']> = RelationshipCollection.notLoaded()
    let countryRelationship: Relationship<Country> = Relationship.notLoaded()

    if (options.includes('appearances')) {
      if (rawModel.appearances) {

        appearancesCollection = RelationshipCollection.initializeCollection()

        rawModel.appearances.forEach((appearance) => {
          const domainModel = TeamAppearanceModelTranslator.toDomain(appearance)

          appearancesCollection.addItem(domainModel, domainModel.id)
        })
      }
    }

    if (options.includes('country')) {
      if (rawModel.country) {
        const domainModel = CountryModelTranslator.toDomain(rawModel.country)

        countryRelationship = Relationship.initializeRelation(domainModel)
      }
    }

    return new Team(
      rawModel.id,
      rawModel.name,
      rawModel.imageUrl,
      rawModel.countryId,
      appearancesCollection,
      countryRelationship
    )
  }
}