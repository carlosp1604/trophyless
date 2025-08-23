import { RelationshipCollection } from '~/modules/Shared/Domain/RelationshipCollection.ts'
import type { Translation } from '~/modules/Translation/Domain/Translation.ts'

export class Country {
  public readonly id: string
  public readonly name: string
  public readonly imageUrl: string

  /** Relationships **/
  private readonly _translations: RelationshipCollection<Translation, string>

  constructor(
    id: string,
    name: string,
    imageUrl: string,
    translations: RelationshipCollection<Translation, string> = RelationshipCollection.notLoaded()
  ) {
    this.id = id
    this.name = name
    this.imageUrl = imageUrl
    this._translations = translations
  }

  public get translations (): Array<Translation> {
    return this._translations.values
  }
}