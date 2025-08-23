export interface TeamAppearanceRawModel {
  id: string
  teamId: string
  competitionId: string
  lastWin: number | null
  lastSeasonWin: string | null
  currentChampion: boolean
  firstParticipation: number
  titlesCount: number
}