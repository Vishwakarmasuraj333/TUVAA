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
  // Must contain only letters (including Unicode letters) with optional spaces, hyphens, apostrophes, and dots between words
  return /^[\p{L}\p{M}]+(?:[\s'’.-]+[\p{L}\p{M}]+)*\.?$/u.test(trimmed)
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
  .min(1, 'Name is required.')
  .min(2, 'Name must be at least 2 characters.')
  .max(100, 'Name is too long.')
  .refine(isHumanName, {
    message: 'Please enter a valid name using letters only.',
  })

export const requiredPhoneNumberSchema = z
  .string()
  .trim()
  .min(1, 'Phone Number is required.')
  .min(7, 'Phone Number must be at least 7 digits.')
  .max(20, 'Phone Number cannot exceed 20 characters.')
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
  .min(1, 'Contact Number is required.')
  .min(7, 'Contact Number must be at least 7 digits.')
  .max(20, 'Contact Number cannot exceed 20 characters.')
  .refine(isPhoneNumber, {
    message: 'Please enter a valid contact number.',
  })

export const organizationNameSchema = z
  .string()
  .trim()
  .min(1, 'Association / Group Name is required.')
  .min(2, 'Association / Group Name must be at least 2 characters.')
  .max(150, 'Association / Group Name is too long.')
  .refine(isOrganizationName, {
    message: 'Please enter a valid association/group name.',
  })

export const cityNameSchema = z
  .string()
  .trim()
  .min(1, 'City is required.')
  .min(2, 'City must be at least 2 characters.')
  .max(100, 'City name is too long.')
  .refine(isCityName, {
    message: 'Please enter a valid city name.',
  })

export const countryNameSchema = z
  .string()
  .trim()
  .min(1, 'Country is required.')
  .min(2, 'Country must be at least 2 characters.')
  .max(100, 'Country name is too long.')
  .refine(isCountryName, {
    message: 'Please enter a valid country name.',
  })
