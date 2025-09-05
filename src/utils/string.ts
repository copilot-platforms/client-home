export const capitalizeFirstLetter = (inputString: string): string => {
  return (
    inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
  )
}

export const preprocessTemplate = (template: string) => {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, p1) => {
    return /^[a-zA-Z0-9.\s]+$/.test(p1) ? match : ''
  })
}

export const normalizeParagraphWhitespace = (html: string) => {
  return html.replace(/<p>(.*?)<\/p>/g, (_, inner) => {
    const cleaned = inner.trim()
    const collapsed = cleaned.replace(/\s+/g, ' ')
    return `<p>${collapsed}</p>`
  })
} //the client home content in client side is automatically clearing whitespaces in paragraph tags. So while saving the content, we need this util to balance things out.
