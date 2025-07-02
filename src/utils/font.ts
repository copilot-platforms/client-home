import { IAppContext } from '@/context'

export const getFont = (appState?: IAppContext | null) =>
  appState?.appState?.font?.replaceAll('+', ' ') || 'sans-serif' // Inter is a sans-serif font so this is a sane fallback
