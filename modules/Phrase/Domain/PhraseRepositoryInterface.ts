export type PhraseRule = {
  id: string
  minDays: number
  templates: string[]
}

export interface PhraseRepositoryInterface {
  /**
    * Get a phrase rule given a timestamp (epoch millis)
    * @param locale Locale to translate phrases
    * @return PhraseRule
    */
  getRules(locale: string): Promise<readonly PhraseRule[]>
}