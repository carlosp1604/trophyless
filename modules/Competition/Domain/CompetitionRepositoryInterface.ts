import type { Competition } from '~/modules/Competition/Domain/Competition.ts'

export type CompetitionRepositoryOptions = 'country'

export interface CompetitionRepositoryInterface {
  /**
     * Get a list of competitions given some pagination and filter parameters
     * @param offset Pagination offset
     * @param limit Pagination limit
     * @return Competition array
     */
  getCompetitions (offset: number, limit: number): Promise<Array<Competition>>
}