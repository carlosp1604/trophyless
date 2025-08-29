import { Country } from '~/modules/Country/Domain/Country.ts'
import { Relationship } from '~/modules/Shared/Domain/Relationship.ts'
import type { Team } from '~/modules/Team/Domain/Team.ts'

export class Competition {
  public readonly id: string
  public readonly name: string
  public readonly type: string
  public readonly imageUrl: string
  public readonly countryId: string

  /** Relationships **/
  private readonly _country: Relationship<Country>
  private readonly _currentChampion: Relationship<Team>

  constructor(
    id: string,
    name: string,
    type: string,
    imageUrl: string,
    countryId: string,
    country: Relationship<Country> = Relationship.notLoaded(),
    currentChampion: Relationship<Team> = Relationship.notLoaded()
  ) {
    this.id = id
    this.name = name
    this.type = type
    this.imageUrl = imageUrl
    this.countryId = countryId
    this._country = country
    this._currentChampion = currentChampion
  }

  public get country (): Country {
    return this._country.value as Country
  }

  public get currentChampion(): Team {
    return this._currentChampion.value as Team
  }
}