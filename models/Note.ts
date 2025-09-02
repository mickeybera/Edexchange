import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
  authorId: string;
  title: string;
  content: string;
  isPublic: boolean;
  tags: string[];
  likes: string[];
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema({
  authorId: {
    type: String,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  tags: [{
    type: String,
  }],
  likes: [{
    type: String,
    ref: 'User',
  }],
  shares: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create indexes for better query performance
NoteSchema.index({ authorId: 1 });
NoteSchema.index({ isPublic: 1 });
NoteSchema.index({ tags: 1 });
NoteSchema.index({ createdAt: -1 });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

