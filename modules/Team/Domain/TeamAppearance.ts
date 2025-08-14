export class TeamAppearance {
  public readonly id: string
  public readonly teamId: string
  public readonly competitionId: string
  public readonly lastWin: number | null
  public readonly lastSeasonWin: string | null
  public readonly currentChampion: boolean
  public readonly firstParticipation: number
  public readonly titlesCount: number

  constructor(
    id: string,
    teamId: string,
    competitionId: string,
    lastWin: number | null,
    lastSeasonWin: string | null,
    currentChampion: boolean,
    firstParticipation: number,
    titlesCount: number
  ) {
    this.id = id
    this.teamId = teamId
    this.competitionId = competitionId
    this.lastWin = lastWin
    this.lastSeasonWin = lastSeasonWin
    this.currentChampion = currentChampion
    this.firstParticipation = firstParticipation
    this.titlesCount = titlesCount
  }
}