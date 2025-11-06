import { CustomLabels } from '@/types/common'

/**
 * Placeholders for custom label / teminologies for a workspace
 */
type CustomLabelPlaceholders =
  | '__client__'
  | '__clients__'
  | '__company__'
  | '__companies__'

/**
 * Keys to map for custom labels / teminologies
 */
const customLabelKeyMapping: Record<
  CustomLabelPlaceholders,
  keyof CustomLabels
> = {
  __client__: 'individualTerm',
  // Below are unnecessary for client home at the moment but still added in case
  __clients__: 'individualTermPlural',
  __company__: 'groupTerm',
  __companies__: 'groupTermPlural',
}

/**
 * Default values to map for custom labels / teminologies in case they haven't been set for a workspace
 */
const customLabelDefaultMapping: Record<CustomLabelPlaceholders, string> = {
  __client__: 'client',
  // Below are unnecessary for client home at the moment but still added in case
  __clients__: 'clients',
  __company__: 'company',
  __companies__: 'companies',
}

/**
 * Prepares custom label for client by replacing the static placeholder for each custom label (client / company + singular / plural)
 * Currently only needs to support singular client with placeholder '__client__'
 */
export const prepareCustomLabel = (
  text: string,
  customLabels?: CustomLabels,
  opts?: {
    isClientMode?: boolean
  },
) => {
  if (!text || !text.includes('__client__')) return text

  let result = text

  for (const [placeholder, key] of Object.entries(customLabelKeyMapping)) {
    let replacement =
      customLabelDefaultMapping[placeholder as CustomLabelPlaceholders]
    if (!opts?.isClientMode) {
      replacement = customLabels?.[key] || replacement
    }
    result = result?.replaceAll(placeholder, replacement.toLowerCase())
  }
  return result
}

export const replaceCustomLabelsWithPlaceholders = (
  content?: string,
  customLabels?: CustomLabels,
) => {
  if (!customLabels) return content ?? ''

  // NOTE: Only hardcoded for client as per Client Home requirements. It's highly unlikely we will
  // get other patterns since these are customFields
  return (
    content?.replaceAll(`{{${customLabels.individualTerm}.`, `{{__client__.`) ??
    ''
  )
}
