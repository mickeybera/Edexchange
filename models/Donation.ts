import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  donorId: string;
  recipientId: string;
  amount: number;
  currency: string;
  message: string;
  isAnonymous: boolean;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema: Schema = new Schema({
  donorId: {
    type: String,
    required: true,
    ref: 'User',
  },
  recipientId: {
    type: String,
    required: true,
    ref: 'User',
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  message: {
    type: String,
    maxlength: 500,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});

// Create indexes for better query performance
DonationSchema.index({ donorId: 1 });
DonationSchema.index({ recipientId: 1 });
DonationSchema.index({ status: 1 });
DonationSchema.index({ createdAt: -1 });

export default mongoose.models.Donation || mongoose.model<IDonation>('Donation', DonationSchema);

