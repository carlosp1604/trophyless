import { Relationship } from '../../Shared/Domain/Relationship.ts'
import { RelationshipCollection } from '../../Shared/Domain/RelationshipCollection.ts'
import { Country } from '../../Team/Country/Domain/Country.ts'
import { TeamAppearance } from '../../Team/Domain/TeamAppearance.ts'

export class Competition {
  public readonly id: string
  public readonly name: string
  public readonly type: string
  public readonly imageUrl: string
  public readonly countryId: string

  /** Relationships **/
  private readonly _teamAppearances: RelationshipCollection<TeamAppearance, TeamAppearance['id']>
  private readonly _country: Relationship<Country>

  constructor(
    id: string,
    name: string,
    type: string,
    imageUrl: string,
    countryId: string,
    teamAppearances: RelationshipCollection<TeamAppearance, TeamAppearance['id']> = RelationshipCollection.notLoaded(),
    country: Relationship<Country> = Relationship.notLoaded()
  ) {
    this.id = id
    this.name = name
    this.type = type
    this.imageUrl = imageUrl
    this.countryId = countryId
    this._teamAppearances = teamAppearances
    this._country = country
  }
}