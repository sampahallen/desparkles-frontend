import { mockRequest } from "./mockClient";
import type { Category, Product } from "../types/catalog";

export async function getProducts(products: Product[]) {
  return mockRequest(products);
}

export async function getCategories(categories: Category[]) {
  return mockRequest(categories);
}

export async function getProductById(products: Product[], id: number) {
  return mockRequest(products.find((product) => product.id === id) ?? null);
}
