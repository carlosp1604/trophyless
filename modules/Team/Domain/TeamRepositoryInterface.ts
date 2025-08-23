import type { Team } from './Team.ts'

export type TeamRepositoryOptions = 'appearances' | 'country'

export interface TeamRepositoryInterface {
  /**
   * Get a Team given its ID
   * @param teamId Team ID
   * @return Team if found or null
   */
  getTeam (teamId: string): Promise<Team | null>

  /**
   * Get a list of teams given some pagination and filter parameters
   * @param offset Pagination offset
   * @param limit Pagination limit
   * @return Team array
   */
  getTeams (offset: number, limit: number): Promise<Array<Team>>
}