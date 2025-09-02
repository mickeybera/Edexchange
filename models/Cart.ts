import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  listingId: string;
  quantity: number;
  addedAt: Date;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
  listingId: {
    type: String,
    required: true,
    ref: 'Listing',
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const CartSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    ref: 'User',
  },
  items: [CartItemSchema],
}, {
  timestamps: true,
});

// Create indexes for better query performance
CartSchema.index({ userId: 1 });

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);

