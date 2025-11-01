export function validateProduct({name, price, quantity, description, category}) {
  if (!name || name.length < 3 || name.length > 100) return 'Name 3-100 chars'
  if (!(price > 0 && price <= 999999999)) return 'Price must be >0 and ≤ 999,999,999'
  if (!(Number.isInteger(quantity) && quantity >= 0 && quantity <= 99999)) return 'Quantity 0-99,999'
  if (description && description.length > 500) return 'Description ≤500 chars'
  const allowed = ['SPORT','ELECTRONIC','FOOD']
  if (!allowed.includes(category)) return 'Invalid category'
  return true
}