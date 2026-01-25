import { nanoid } from 'nanoid'

export const generateShortCode = (length = 8): string => {
  return nanoid(length)
}

export const isValidShortCode = (code: string): boolean => {
  // Short codes should be alphanumeric and at least 6 characters
  return /^[A-Za-z0-9_-]{6,}$/.test(code)
}
