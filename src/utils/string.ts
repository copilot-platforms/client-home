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
