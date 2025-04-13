import { ObjectId } from 'mongodb';

export interface CacheData {
  _id: string;
  [key: string]: any;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CartData extends CacheData {
  userId: string;
  items: CartItem[];
  total: number;
}

export interface ProductData extends CacheData {
  title: string;
  description: string;
  price: number;
  categories: string[];
  image: string[];
  unit_of_measure: string;
  amount: number;
  rating: number;
  shop_category: string;
}

export interface SessionData extends CacheData {
  userId: string;
  role: string;
  exp: number;
}