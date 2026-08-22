import { z } from 'zod'

/**
 * Validates human names (First, Middle, Last, Titles).
 * Allows Unicode letters, spaces, hyphens, apostrophes, and dots.
 * Rejects numbers, special symbols, and strings without letters.
 */
export function isHumanName(val: string): boolean {
  if (!val) return false
  const trimmed = val.trim()
  if (trimmed.length < 2 || trimmed.length > 100) return false
  // Must contain at least 2 Unicode letters
  const lettersMatch = trimmed.match(/[\p{L}\p{M}]/gu)
  if (!lettersMatch || lettersMatch.length < 2) return false
  // Must only contain letters, spaces, hyphens, apostrophes, and periods
  return /^[\p{L}\p{M}\s.'’-]+$/u.test(trimmed)
}

/**
 * Validates international and domestic phone numbers.
 * Allows digits, optional leading +, spaces, hyphens, dots, and parentheses.
 * Rejects alphabetic characters and arbitrary symbols.
 * Enforces 7 to 15 digits (E.164 standard) and max 20 characters total string length.
 */
export function isPhoneNumber(val: string): boolean {
  if (!val) return false
  const trimmed = val.trim()
  if (trimmed.length < 7 || trimmed.length > 20) return false
  // Must match allowed phone characters: optional leading +, digits, spaces, parentheses, hyphens, dots
  if (!/^\+?[0-9\s().-]{7,20}$/.test(trimmed)) return false
  // Extract pure digits and verify length is between 7 and 15 digits
  const digitsOnly = trimmed.replace(/\D/g, '')
  return digitsOnly.length >= 7 && digitsOnly.length <= 15
}

/**
 * Normalizes phone numbers for storage (trims and collapses redundant whitespace).
 */
export function normalizePhoneNumber(val?: string | null): string | null {
  if (!val) return null
  const trimmed = val.trim().replace(/\s+/g, ' ')
  return trimmed || null
}

/**
 * Validates association/organization/community group names.
 * Allows letters, numbers, spaces, and standard organization punctuation (&, -, ', (, ), ,, .).
 * Requires at least 2 letters. Rejects numeric-only and symbol-only input.
 */
export function isOrganizationName(val: string): boolean {
  if (!val) return false
  const trimmed = val.trim()
  if (trimmed.length < 2 || trimmed.length > 150) return false
  const lettersMatch = trimmed.match(/[\p{L}\p{M}]/gu)
  if (!lettersMatch || lettersMatch.length < 2) return false
  return /^[\p{L}\p{M}0-9\s&'’().,-]+$/u.test(trimmed)
}

/**
 * Validates city and town place names.
 * Allows Unicode letters, spaces, hyphens, apostrophes, and dots (e.g. St. John's, Southampton, New York).
 * Rejects numbers and special symbols.
 */
export function isCityName(val: string): boolean {
  if (!val) return false
  const trimmed = val.trim()
  if (trimmed.length < 2 || trimmed.length > 100) return false
  const lettersMatch = trimmed.match(/[\p{L}\p{M}]/gu)
  if (!lettersMatch || lettersMatch.length < 2) return false
  return /^[\p{L}\p{M}\s.'’-]+$/u.test(trimmed)
}

/**
 * Validates country names and origin designations (e.g. "Nigeria / Zimbabwe", "United Kingdom", "Côte d'Ivoire").
 * Allows Unicode letters, spaces, hyphens, apostrophes, slashes, commas, and parentheses.
 * Rejects numbers and arbitrary symbols.
 */
export function isCountryName(val: string): boolean {
  if (!val) return false
  const trimmed = val.trim()
  if (trimmed.length < 2 || trimmed.length > 100) return false
  const lettersMatch = trimmed.match(/[\p{L}\p{M}]/gu)
  if (!lettersMatch || lettersMatch.length < 2) return false
  return /^[\p{L}\p{M}\s.'’/(),-]+$/u.test(trimmed)
}

// Reusable Zod Schemas
export const humanNameSchema = z
  .string()
  .trim()
  .min(2, 'Please enter a valid name.')
  .max(100, 'Name is too long.')
  .refine(isHumanName, {
    message: 'Please enter a valid name.',
  })

export const requiredPhoneNumberSchema = z
  .string()
  .trim()
  .min(7, 'Please enter a valid phone number.')
  .max(20, 'Phone number is too long.')
  .refine(isPhoneNumber, {
    message: 'Please enter a valid phone number.',
  })

export const optionalPhoneNumberSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .refine((val) => !val || isPhoneNumber(val), {
    message: 'Please enter a valid phone number.',
  })

export const membershipContactNumberSchema = z
  .string()
  .trim()
  .min(7, 'Please enter a valid contact number.')
  .max(20, 'Contact number cannot exceed 20 characters.')
  .refine(isPhoneNumber, {
    message: 'Please enter a valid contact number.',
  })

export const organizationNameSchema = z
  .string()
  .trim()
  .min(2, 'Community group/Association name must be at least 2 characters.')
  .max(150, 'Community group/Association name is too long.')
  .refine(isOrganizationName, {
    message: 'Please enter a valid organization/group name.',
  })

export const cityNameSchema = z
  .string()
  .trim()
  .min(2, 'City is required.')
  .max(100, 'City name is too long.')
  .refine(isCityName, {
    message: 'Please enter a valid city name.',
  })

export const countryNameSchema = z
  .string()
  .trim()
  .min(2, 'Country is required.')
  .max(100, 'Country name is too long.')
  .refine(isCountryName, {
    message: 'Please enter a valid country name.',
  })
