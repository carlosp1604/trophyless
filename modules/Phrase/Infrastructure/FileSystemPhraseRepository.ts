import phrasesEn from '~/data/phrases.en.json'
import phrasesEs from '~/data/phrases.es.json'
import type { PhraseRepositoryInterface, PhraseRule } from '~/modules/Phrase/Domain/PhraseRepositoryInterface.ts'

const RULES_BY_LOCALE: Record<string, PhraseRule[]> = {
  es: phrasesEs as PhraseRule[],
  en: phrasesEn as PhraseRule[],
}

function sortByMinDaysAsc(rules: PhraseRule[]): PhraseRule[] {
  return rules.slice().sort((a, b) => a.minDays - b.minDays)
}

export class FileSystemPhraseRepository implements PhraseRepositoryInterface {
  private cache = new Map<string, PhraseRule[]>()

  async getRules(locale: string): Promise<PhraseRule[]> {
    const key = RULES_BY_LOCALE[locale] ? locale : 'es'

    if (this.cache.has(key)) {
      return this.cache.get(key)!
    }
    const sorted = sortByMinDaysAsc(RULES_BY_LOCALE[key] ?? RULES_BY_LOCALE.es)

    this.cache.set(key, sorted)

    return sorted
  }
}
