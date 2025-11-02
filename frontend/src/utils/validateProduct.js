export function validateProduct(product) {
  if (!product) return 'Invalid product'

  const errors = {}

  if (!product.name || product.name.trim() === '') {
    errors.name = 'Product name is required'
  }

  if (product.price == null || product.price <= 0) {
    errors.price = 'Price must be greater than 0'
  }

  if (product.quantity == null || product.quantity < 0) {
    errors.quantity = 'Quantity cannot be negative'
  }

  if (product.description && product.description.length > 500) {
    errors.description = 'Description too long'
  }

  const validCategories = ['Electronics', 'Food', 'Clothing', 'SPORT', 'Accessories']
  if (product.category && !validCategories.includes(product.category)) {
    errors.category = 'Invalid category'
  }

  if (Object.keys(errors).length === 0) return true
  if (Object.keys(errors).length === 0) return {}
  return errors
}
