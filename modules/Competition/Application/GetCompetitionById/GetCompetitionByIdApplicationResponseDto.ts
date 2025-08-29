import type { CompetitionApplicationDto } from '~/modules/Competition/Application/CompetitionApplicationDto.ts'
import type {
  TeamWithoutAppearancesApplicationDto
} from '~/modules/Team/Application/TeamWithoutAppearancesApplicationDto.ts'

export interface GetCompetitionByIdApplicationResponseDto {
  competition: CompetitionApplicationDto
  currentChampion: TeamWithoutAppearancesApplicationDto
}