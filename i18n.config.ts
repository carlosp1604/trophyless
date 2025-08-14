const supportedLanguages = [ 'en', 'es' ] as const

export type Locale = typeof supportedLanguages[number]

export const i18nConfig = {
  locales: supportedLanguages.map((locale) => locale),
  defaultLocale: supportedLanguages[0],
}