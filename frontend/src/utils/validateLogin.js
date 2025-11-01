export function validateUsername(u) {
  if (typeof u !== 'string') return 'Username required'
  if (u.length < 3 || u.length > 50) return 'Username 3-50 chars'
  if (!/^[A-Za-z0-9._\- ]+$/.test(u)) return 'Invalid characters'
  return true
}
export function validatePassword(p) {
  if (typeof p !== 'string') return 'Password required'
  if (p.length < 6 || p.length > 100) return 'Password 6-100 chars'
  if (!/[A-Za-z]/.test(p) || !/[0-9]/.test(p)) return 'Must include letters and numbers'
  return true
}