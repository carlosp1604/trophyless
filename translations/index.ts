/* eslint-disable  @typescript-eslint/no-explicit-any */
import en from './en.json'
import es from './es.json'

import { i18nConfig, type Locale } from '../i18n.config.ts'

const translations: Record<Locale, Record<string, any>> = { en, es }

export function t(lang: Locale, key: string): string {
  const parts = key.split('.')
  let value: any = translations[lang]

  for (const part of parts) {
    value = value?.[part]
    if (value === undefined) return key // fallback
  }

  return value
}

export function changeLanguage(lang: Locale) {
  if (!i18nConfig.locales.includes(lang)) {
    console.warn(`Language ${lang} is not supported`)
    return
  }

  const pathParts = window.location.pathname.split('/').filter(Boolean)

  if (i18nConfig.locales.includes(pathParts[0] as Locale)) {
    pathParts[0] = lang
  } else {
    pathParts.unshift(lang)
  }

  window.location.href =  '/' + pathParts.join('/') + window.location.search + window.location.hash + '/'
}