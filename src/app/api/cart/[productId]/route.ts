import { NextRequest, NextResponse } from 'next/server';
import { Cart } from '@/lib/models/cart';
import { requireAuth } from '@/lib/auth/middleware';
import { CartCache } from '@/lib/redis/cartCache';
import { ProductCache } from '@/lib/redis/productCache';
import { CartData } from '@/lib/types/cache';
import dbConnect from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const auth = await requireAuth(request);
    await dbConnect();
    
    const body = await request.json();
    const { quantity } = body;

    // Get cart from cache first
    let cartData = await CartCache.getCart(auth.userId);
    
    if (!cartData) {
      // If not in cache, get from DB
      const dbCart = await Cart.findOne({ userId: auth.userId });
      if (!dbCart) {
        return NextResponse.json(
          { error: 'Cart not found' },
          { status: 404 }
        );
      }
      cartData = dbCart.toCache();
      // Only set cache if we have valid cart data
      if (cartData) {
        await CartCache.setCart(auth.userId, cartData);
      }
    }

    // Validate cart data before proceeding
    if (!cartData || !Array.isArray(cartData.items)) {
      return NextResponse.json(
        { error: 'Invalid cart data' },
        { status: 500 }
      );
    }

    const itemIndex = cartData.items.findIndex(
      item => item.productId === params.productId
    );

    if (itemIndex === -1) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }

    // Update cart in DB
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: auth.userId },
      { 
        $set: { [`items.${itemIndex}.quantity`]: quantity },
        $inc: { total: (quantity - cartData.items[itemIndex].quantity) * cartData.items[itemIndex].price }
      },
      { new: true }
    );

    if (!updatedCart) {
      return NextResponse.json(
        { error: 'Failed to update cart' },
        { status: 500 }
      );
    }

    // Update cache with the new cart data
    const updatedCartData = updatedCart.toCache();
    await CartCache.setCart(auth.userId, updatedCartData);

    return NextResponse.json(updatedCartData);
  } catch (error: any) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}

// Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const auth = await requireAuth(request);
    await dbConnect();
    
    const cart = await Cart.findOne({ user: auth.userId });
    if (!cart) {
      return NextResponse.json(
        { error: 'Cart not found' },
        { status: 404 }
      );
    }
    
    cart.items = cart.items.filter(
      (item: { product: { toString: () => string } }) => item.product.toString() !== params.productId
    );
    
    await cart.save();
    
    return NextResponse.json(cart);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: error.message === 'Authentication required' ? 401 : 500 }
    );
  }
}
