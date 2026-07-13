export function formatPrice(price: number) {
  return `GHS ${price.toLocaleString()}`;
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
