import type {
  GetPhraseForTimeApplicationRequestDto
} from '~/modules/Phrase/Application/GetPhraseForTime/GetPhraseForTimeApplicationRequestDto.ts'
import type {
  GetPhraseForTimeApplicationResponseDto
} from '~/modules/Phrase/Application/GetPhraseForTime/GetPhraseForTimeApplicationResponseDto.ts'
import type { PhraseRepositoryInterface } from '~/modules/Phrase/Domain/PhraseRepositoryInterface.ts'
import type { PhraseSelector } from '~/modules/Phrase/Domain/PhraseSelector.ts'
import type { Result } from '~/modules/Shared/Domain/Result'

export class GetPhraseForTime {
  constructor(
    private readonly phraseRepository: PhraseRepositoryInterface,
    private readonly selector: PhraseSelector,
    private readonly defaultLocale: string
  ) {
  }

  public async get(
    request: GetPhraseForTimeApplicationRequestDto
  ): Promise<Result<GetPhraseForTimeApplicationResponseDto, never>> {
    const locale = request.locale ?? this.defaultLocale
    const rules = await this.phraseRepository.getRules(locale)

    const { phrase, ruleId, variantIndex } = this.selector.select(
      [ ...rules ],
      request.lastWinTimestamp,
      { team: request.teamName, locale, random: request.random, seed: request.seed }
    )

    return {
      success: true,
      value: { phrase, ruleId, variantIndex }
    }
  }
}
