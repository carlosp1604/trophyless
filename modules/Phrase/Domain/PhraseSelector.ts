import type { PhraseRule } from '~/modules/Phrase/Domain/PhraseRepositoryInterface.ts'
import { PhraseSelection } from '~/modules/Phrase/Domain/PhraseSelection.ts'

export type PhraseContext = {
  team?: string
  nowMs?: number
  locale?: string
  random?: boolean
  seed?: string | number
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

const daysBetween = (fromMs: number, toMs: number) =>
  Math.max(0, Math.floor((toMs - fromMs) / MS_PER_DAY))

const yearsApprox = (d: number) => Math.floor(d / 365)
const monthsApprox = (d: number) => Math.floor(d / 30)

const interpolate = (tpl: string, vars: Record<string, string | number | undefined>) =>
  tpl.replace(/\{(\w+)\}/g, (_m, k) => (vars[k] ?? '').toString())

function hashToIndex(input: string, modulo: number): number {
  let h = 5381

  for (let i = 0; i < input.length; i++) h = ((h << 5) + h) + input.charCodeAt(i)
  const idx = h % modulo

  return idx < 0 ? idx + modulo : idx
}

export class PhraseSelector {
  public select(
    rules: PhraseRule[],
    lastWinTimestamp: number | null,
    ctx: PhraseContext = {}
  ): PhraseSelection {
    const now = ctx.nowMs ?? Date.now()

    let days = 0
    let rule: PhraseRule | undefined

    if (lastWinTimestamp == null) {
      rule = rules.find(r => r.id === 'never_won') ?? rules[0]
    } else {
      days = daysBetween(lastWinTimestamp, now)
      for (const r of rules) {
        if (r.minDays <= days) rule = r
        else break
      }
      rule ||= rules[0]
    }

    const variants = rule.templates.length ? rule.templates : [ '' ]
    const variantIndex = ctx.random
      ? Math.floor(Math.random() * variants.length)
      : hashToIndex(`${ctx.seed ?? `${ctx.team ?? ''}|${ctx.locale ?? ''}|${days}`}`, variants.length)

    const template = variants[variantIndex]

    const phrase = interpolate(template, {
      team: ctx.team,
      days,
      months: monthsApprox(days),
      years: yearsApprox(days),
    })

    return new PhraseSelection(phrase, rule.id, variantIndex)
  }
}
