import mongoose, { Schema, Document } from 'mongoose';

export interface IDonatedItem extends Document {
  title: string;
  description: string;
  category: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  donorName: string;
  donorEmail?: string;
  donorPhone?: string;
  images: string[];
  available: boolean;
  borrowedBy?: string;
  borrowedAt?: Date;
  returnedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DonatedItemSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  category: {
    type: String,
    required: true,
    enum: ['books', 'electronics', 'clothing', 'furniture', 'sports', 'stationery', 'lab-equipment', 'tools', 'other'],
  },
  condition: {
    type: String,
    required: true,
    enum: ['excellent', 'good', 'fair', 'poor'],
  },
  donorName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  donorEmail: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  donorPhone: {
    type: String,
    trim: true,
    maxlength: 20,
  },
  images: [{
    type: String,
    trim: true,
  }],
  available: {
    type: Boolean,
    default: true,
  },
  borrowedBy: {
    type: String,
    trim: true,
    maxlength: 100,
  },
  borrowedAt: {
    type: Date,
  },
  returnedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Create indexes for better query performance
DonatedItemSchema.index({ category: 1 });
DonatedItemSchema.index({ available: 1 });
DonatedItemSchema.index({ createdAt: -1 });
DonatedItemSchema.index({ donorName: 1 });

export default mongoose.models.DonatedItem || mongoose.model<IDonatedItem>('DonatedItem', DonatedItemSchema);



