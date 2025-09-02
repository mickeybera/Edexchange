import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  eventDate: Date;
  organizer: string;
  eventLink?: string;
  description?: string;
  location?: string;
  time?: string;
  category?: string;
  imageUrl?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  status: 'active' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  organizer: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  eventLink: {
    type: String,
    trim: true,
    maxlength: 500,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  location: {
    type: String,
    trim: true,
    maxlength: 200,
  },
  time: {
    type: String,
    trim: true,
    maxlength: 10,
  },
  category: {
    type: String,
    trim: true,
    maxlength: 50,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  maxAttendees: {
    type: Number,
    default: 0, // 0 means unlimited
    min: 0,
  },
  currentAttendees: {
    type: Number,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'completed'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Create indexes for better query performance
EventSchema.index({ eventDate: 1 });
EventSchema.index({ organizer: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ createdAt: -1 });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

