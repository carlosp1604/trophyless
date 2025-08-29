export class PhraseSelection {
  constructor(
    public readonly phrase: string,
    public readonly ruleId: string,
    public readonly variantIndex: number
  ) {
  }
}