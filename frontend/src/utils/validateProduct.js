export function validateProduct(product) {
  if (!product) return 'Invalid product'

  const errors = {}

  if (!product.name || product.name.trim() === '') {
    errors.name = 'Product name is required'
  }

  if(product.name && product.name.length > 100) {
    errors.name = 'Product name must be less than 100 characters'
  }

  if(product.name && product.name.length < 3) {
    errors.name = 'Product name must be at least 3 characters'
  }

  if (product.price == null || product.price <= 0) {
    errors.price = 'Price must be greater than 0'
  }

  if (product.price >= 1000000000) {
    errors.price = 'Price must be less than 1 billion'
  }

  if (product.quantity == null || product.quantity < 0) {
    errors.quantity = 'Quantity cannot be negative'
  }

  if (product.description && product.description.length > 500) {
    errors.description = 'Description too long'
  }

  const validCategories = ['ELECTRONICS', 'FOOD', 'CLOTHING', 'SPORT', 'ACCESSORIES']
  if (product.category && !validCategories.includes(product.category)) {
    errors.category = 'Invalid category'
  }

  if (Object.keys(errors).length === 0) return true;
  return errors;
}
