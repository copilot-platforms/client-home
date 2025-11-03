import Handlebars, { TemplateDelegate } from 'handlebars'

/**
 * Safely compiles a Handlebars template.
 * Invalid/malformed placeholders like {{client.}} are removed.
 * Missing properties resolve to empty string.
 */
export const safeCompile = (templateSource: string): TemplateDelegate => {
  const sanitizedTemplate = templateSource.replace(/{{\s*[\w]+\.\s*}}/g, '') // Remove placeholders ending with a dot

  Handlebars.registerHelper('helperMissing', () => '')

  return Handlebars?.compile(sanitizedTemplate, { strict: false })
}
