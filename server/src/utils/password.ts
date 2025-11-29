export interface StrengthResult {
  score: number // 0-4
  label: string
  suggestions: string[]
}

export function evaluatePasswordStrength(pw: string): StrengthResult {
  let score = 0
  const suggestions: string[] = []
  if (pw.length >= 8) score++; else suggestions.push('Use at least 8 characters')
  if (/[A-Z]/.test(pw)) score++; else suggestions.push('Add an uppercase letter')
  if (/[0-9]/.test(pw)) score++; else suggestions.push('Include a number')
  if (/[^A-Za-z0-9]/.test(pw)) score++; else suggestions.push('Include a symbol')
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Excellent']
  return { score, label: labels[score], suggestions }
}

export function validateStrongPassword(pw: string): string | null {
  const { score, suggestions } = evaluatePasswordStrength(pw)
  if (score < 3) return 'Password too weak: ' + suggestions.slice(0,2).join(', ')
  return null
}
