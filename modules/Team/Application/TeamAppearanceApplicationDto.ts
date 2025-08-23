export interface TeamAppearanceApplicationDto {
  id: string
  lastWin: number | null
  lastSeasonWin: string | null
  currentChampion: boolean
  firstParticipation: number
  titlesCount: number
}