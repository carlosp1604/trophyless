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

  /**
    * Get the time without trophy for a team given a competition
    * @param teamId Team ID
    * @param competitionId Competition ID
    * @return Time in milliseconds (epoch millis) since last trophy if found or null
    */
  getTimeWithoutTrophy (teamId: string, competitionId: string): Promise<number | null>
}