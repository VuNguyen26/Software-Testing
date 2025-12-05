export function validateProduct(p) {
  const errors = {};

  if (!p) {
    errors.general = "Invalid product";
    return errors;
  }

  // NAME validation
  if (!p.name || p.name.trim() === "") {
    errors.name = "Product name is required";
  } else if (p.name.length < 3) {
    errors.name = "Product name is too short";
  } else if (p.name.length > 100) {
    errors.name = "Product name is too long";
  }

  // DESCRIPTION validation
  if (p.description && p.description.length > 500) {
    errors.description = "Description too long";
  }

  // PRICE validation
  if (p.price == null || p.price <= 0) {
    errors.price = "Price must be greater than 0";
  } else if (p.price > 999999999) {
    errors.price = "Price must be less than 1 billion";
  }

  // QUANTITY validation
  if (p.quantity == null || p.quantity < 0) {
    errors.quantity = "Quantity cannot be negative";
  }

  // CATEGORY validation
  const validCategories = ["ELECTRONICS", "FOOD", "CLOTHING", "SPORT", "ACCESSORIES"];
  if (p.category && !validCategories.includes(p.category)) {
    errors.category = "Invalid category";
  }

  return errors;
}
