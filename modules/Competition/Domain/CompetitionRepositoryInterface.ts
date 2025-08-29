import type { Competition } from '~/modules/Competition/Domain/Competition.ts'
import type { CompetitionCriteria } from '~/modules/Competition/Domain/CompetitionCriteria.ts'
import type { Page } from '~/modules/Shared/Domain/Page.ts'

export type CompetitionRepositoryOptions = 'country' | 'currentChampion'

export interface CompetitionRepositoryInterface {
  /**
    * Get a list of competitions given some pagination and filter parameters
    * @param criteria Competition Criteria
    * @return Competitions page
    */
  getCompetitions (criteria: CompetitionCriteria): Promise<Page<Competition>>

  /**
    * Get a Competition given its ID
    * @param competitionId Competition ID
    * @return Competition if found or null
    */
  getCompetitionById (competitionId: string): Promise<Competition | null>
}