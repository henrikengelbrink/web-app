export const firstLetterUppercase = (string) => {
  return `${string.substr(0, 1).toUpperCase()}${string.substr(1).toLowerCase()}`
}
