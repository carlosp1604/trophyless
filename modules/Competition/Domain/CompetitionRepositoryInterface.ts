import type { Competition } from '~/modules/Competition/Domain/Competition.ts'
import type { CompetitionCriteria } from '~/modules/Competition/Domain/CompetitionCriteria.ts'
import type { Page } from '~/modules/Shared/Domain/Page.ts'

export type CompetitionRepositoryOptions = 'country'

export interface CompetitionRepositoryInterface {
  /**
    * Get a list of competitions given some pagination and filter parameters
    * @param criteria Competition Criteria
    * @return Competitions page
    */
  getCompetitions (criteria: CompetitionCriteria): Promise<Page<Competition>>
}