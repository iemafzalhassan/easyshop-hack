import { CartData } from '../types/cache';
// Change import to use correct case
import { cacheService } from './cacheService';

export class CartCache {
  private static readonly PREFIX = 'cart:';
  private static readonly TTL = 3600; // 1 hour

  static async getCart(userId: string): Promise<CartData | null> {
    return cacheService.get<CartData>(`${this.PREFIX}${userId}`);
  }

  static async setCart(userId: string, data: CartData): Promise<void> {
    if (!data || !data.userId || !Array.isArray(data.items)) {
      throw new Error('Invalid cart data');
    }
    await cacheService.set<CartData>(`${this.PREFIX}${userId}`, data, this.TTL);
  }

  static async invalidateCart(userId: string): Promise<void> {
    await cacheService.del(`${this.PREFIX}${userId}`);
  }

  static async updateCartItem(
    userId: string, 
    productId: string, 
    quantity: number
  ): Promise<CartData | null> {
    const cart = await this.getCart(userId);
    if (!cart || !Array.isArray(cart.items)) {
      return null;
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) return null;

    cart.items[itemIndex].quantity = quantity;
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    await this.setCart(userId, cart);
    return cart;
  }
}