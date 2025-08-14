export class Country {
  public readonly id: string
  public readonly name: string
  public readonly imageUrl: string

  constructor(id: string, name: string, imageUrl: string) {
    this.id = id
    this.name = name
    this.imageUrl = imageUrl
  }
}