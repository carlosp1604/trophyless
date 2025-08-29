export interface GetPhraseForTimeApplicationRequestDto {
  lastWinTimestamp: number | null
  teamName?: string
  locale?: string
  random?: boolean
  seed?: string | number
}