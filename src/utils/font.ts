import { IAppContext } from '@/context'

export const getFont = (appState?: IAppContext | null) =>
  appState?.appState?.font?.replaceAll('+', ' ') || 'sans'
