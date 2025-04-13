import { cacheService } from './cacheService';
import { ProductData } from '../types/cache';

export class ProductCache {
  private static readonly PREFIX = 'product:';
  private static readonly TTL = 3600; // 1 hour cache
  private static readonly CATEGORY_PREFIX = 'category:';
  private static readonly CATEGORY_TTL = 1800; // 30 minutes for categories

  static async getProduct(productId: string): Promise<ProductData | null> {
    try {
      return await cacheService.get<ProductData>(`${this.PREFIX}${productId}`);
    } catch (error) {
      console.error('Error getting product from cache:', error);
      return null; // Fail gracefully
    }
  }

  static async setProduct(product: ProductData): Promise<void> {
    try {
      await cacheService.set<ProductData>(
        `${this.PREFIX}${product._id}`, 
        product,
        this.TTL
      );
    } catch (error) {
      console.error('Error setting product in cache:', error);
      // Continue execution even if cache fails
    }
  }

  static async getCategoryProducts(category: string): Promise<ProductData[] | null> {
    try {
      const result = await cacheService.get<{ _id: string, products: ProductData[] }>(`${this.CATEGORY_PREFIX}${category}`);
      return result?.products || null;
    } catch (error) {
      console.error('Error getting category products from cache:', error);
      return null;
    }
  }

  static async setCategoryProducts(category: string, products: ProductData[]): Promise<void> {
    try {
      await cacheService.set<{ _id: string, products: ProductData[] }>(
        `${this.CATEGORY_PREFIX}${category}`,
        { _id: category, products: products },
        this.CATEGORY_TTL
      );
    } catch (error) {
      console.error('Error setting category products in cache:', error);
    }
  }
}