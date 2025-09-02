import mongoose, { Schema, Document } from 'mongoose';

export interface IReview {
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IListing extends Document {
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  images: string[];
  location: string;
  tags: string[];
  status: 'active' | 'sold' | 'inactive';
  views: number;
  likes: string[];
  
  // Enhanced item details
  brand?: string;
  model?: string;
  year?: number;
  edition?: string;
  isbn?: string;
  publisher?: string;
  author?: string;
  pages?: number;
  language?: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit?: string;
  };
  weight?: {
    value: number;
    unit: string;
  };
  
  // Ratings and reviews
  averageRating: number;
  totalRatings: number;
  reviews: IReview[];
  
  // Additional details
  warranty?: string;
  returnPolicy?: string;
  shippingInfo?: string;
  contactInfo?: {
    phone?: string;
    email?: string;
    preferredContact?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ListingSchema: Schema = new Schema({
  sellerId: {
    type: String,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    default: 'good',
  },
  images: [{
    type: String,
  }],
  location: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'sold', 'inactive'],
    default: 'active',
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: String,
    ref: 'User',
  }],
  
  // Enhanced item details
  brand: String,
  model: String,
  year: Number,
  edition: String,
  isbn: String,
  publisher: String,
  author: String,
  pages: Number,
  language: String,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ['cm', 'inch', 'mm'],
      default: 'cm',
    },
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'g', 'lb', 'oz'],
      default: 'kg',
    },
  },
  
  // Ratings and reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalRatings: {
    type: Number,
    default: 0,
  },
  reviews: [ReviewSchema],
  
  // Additional details
  warranty: String,
  returnPolicy: String,
  shippingInfo: String,
  contactInfo: {
    phone: String,
    email: String,
    preferredContact: {
      type: String,
      enum: ['phone', 'email', 'both'],
      default: 'email',
    },
  },
}, {
  timestamps: true,
});

// Create indexes for better query performance
ListingSchema.index({ sellerId: 1 });
ListingSchema.index({ category: 1 });
ListingSchema.index({ status: 1 });
ListingSchema.index({ price: 1 });
ListingSchema.index({ createdAt: -1 });
ListingSchema.index({ averageRating: -1 });
ListingSchema.index({ totalRatings: -1 });

// Method to update average rating
ListingSchema.methods.updateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
    this.totalRatings = this.reviews.length;
  }
  return this.save();
};

export default mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);
