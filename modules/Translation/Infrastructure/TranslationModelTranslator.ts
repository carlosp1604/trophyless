import { Translation } from '~/modules/Translation/Domain/Translation.ts'
import type { TranslationRawModel } from '~/modules/Translation/Infrastructure/TranslationRawModel.ts'

export class TranslationModelTranslator {
  public static toDomain(rawModel: TranslationRawModel): Translation {
    return new Translation(
      rawModel.type,
      rawModel.translatableId,
      rawModel.field,
      rawModel.language,
      rawModel.value
    )
  }
}