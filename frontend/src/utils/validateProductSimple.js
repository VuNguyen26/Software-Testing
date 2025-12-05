export function validateProductSimple(p) {
  if (!p.name || p.name.trim() === "") return false;

  if (p.price <= 0) return false;

  if (p.price > 1000000000) return false;

  if (p.quantity < 0) return false;

  if (p.description && p.description.length > 500) return false;

  const validCategories = ["SPORT", "FOOD", "CLOTHING", "ELECTRONICS", "ACCESSORIES"];
  if (p.category && !validCategories.includes(p.category)) return false;

  return true;
}
