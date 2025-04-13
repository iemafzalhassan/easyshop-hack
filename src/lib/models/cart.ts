import mongoose, { Schema, Document } from 'mongoose';
import { CartData, CartItem } from '../types/cache';

export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
  toCache(): CartData;
}

const CartSchema = new Schema<ICart>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  items: [{
    productId: {
      type: String,
      required: true,
      ref: 'Product'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  total: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

CartSchema.methods.toCache = function(): CartData {
  return {
    _id: this._id.toString(),
    userId: this.userId,
    items: this.items.map((item: ICartItem) => ({
      productId: item.productId.toString(),
      quantity: item.quantity,
      price: item.price
    })),
    total: this.total
  };
};

const Cart = mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

// export to include both named and default export
export { Cart as default, Cart };
