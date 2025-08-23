import type { CountryRawModel } from './RawModels/CountryRawModel.ts'
import { Country } from '~/modules/Country/Domain/Country.ts'
import { RelationshipCollection } from '~/modules/Shared/Domain/RelationshipCollection.ts'
import type { Translation } from '~/modules/Translation/Domain/Translation.ts'
import { TranslationModelTranslator } from '~/modules/Translation/Infrastructure/TranslationModelTranslator.ts'

export class CountryModelTranslator {
  public static toDomain (rawModel: CountryRawModel): Country {

    const translations = RelationshipCollection.initializeCollection<Translation, string>()

    for (const translation of rawModel.translations) {
      const domainModel = TranslationModelTranslator.toDomain(translation)

      translations.addItem(domainModel, `${domainModel['language']}-${domainModel['field']}`)
    }

    return new Country(
      rawModel.id,
      rawModel.name,
      rawModel.imageUrl,
      translations
    )
  }
}