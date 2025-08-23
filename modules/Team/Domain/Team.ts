import { TeamAppearance } from './TeamAppearance.ts'
import { Country } from '~/modules/Country/Domain/Country.ts'
import { Relationship } from '~/modules/Shared/Domain/Relationship.ts'
import { RelationshipCollection } from '~/modules/Shared/Domain/RelationshipCollection.ts'

export class Team {
  public readonly id: string
  public readonly name: string
  public readonly imageUrl: string
  public readonly countryId: string
    
  /** Relationships **/
  private readonly _appearances: RelationshipCollection<TeamAppearance, TeamAppearance['id']>
  private readonly _country: Relationship<Country>

  constructor(
    id: string,
    name: string,
    imageUrl: string,
    countryId: string,
    appearances: RelationshipCollection<TeamAppearance, TeamAppearance['id']> = RelationshipCollection.notLoaded(),
    country: Relationship<Country> = Relationship.notLoaded()
  ) {
    this.id = id
    this.name = name
    this.imageUrl = imageUrl
    this.countryId = countryId
    this._appearances = appearances
    this._country = country
  }

  public get appearances (): Array<TeamAppearance> {
    return this._appearances.values
  }

  public get country (): Country {
    return this._country.value as Country
  }
}