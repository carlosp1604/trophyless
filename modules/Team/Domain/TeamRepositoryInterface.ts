import type { Team } from './Team.ts'
import type { Page } from '~/modules/Shared/Domain/Page.ts'
import type { TeamsCriteria } from '~/modules/Team/Domain/TeamsCriteria.ts'

export type TeamRepositoryRelationshipOptions = 'appearances' | 'country'

export interface TeamRepositoryInterface {
  /**
   * Get a Team given its ID
   * @param teamId Team ID
   * @return Team if found or null
   */
  getTeam (teamId: string): Promise<Team | null>

  /**
   * Get a list of teams given a TeamsPage
   * @param criteria Team Criteria
   * @return Teams page
   */
  getTeams (criteria: TeamsCriteria): Promise<Page<Team>>

  /**
    * Get the timestamp of the team's most recent win in the given competition.
    * @param teamId Team ID
    * @param competitionId Competition ID
    * @return Timestamp (epoch millis, UTC) of the most recent win, or null if the team has never won this competition.
    */
  getLastWinTimestamp (teamId: string, competitionId: string): Promise<number | null>

  /**
    * Get a list of the most popular teams
    * V1 -> Hardcoded team list
    * @return Team array
    */
  getPopularTeams (): Promise<Array<Team>>
}