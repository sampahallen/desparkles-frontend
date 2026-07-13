export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  badge?: string;
  inStock: number;
  rating: number;
  reviews: number;
  description: string;
  materials?: string;
  care?: string;
  colors?: string[];
  occasions?: string[];
}

export interface CartItem {
  product: Product;
  qty: number;
  color?: string;
}

export interface Category {
  id: string;
  label: string;
}
