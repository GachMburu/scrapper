import mongoose, { Schema, Document } from 'mongoose';

export interface IDataset extends Document {
  name: string;
  description?: string;
  sourceUrl?: string;
  price: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DatasetSchema = new Schema<IDataset>(
  {
    name: { type: String, required: true },
    description: { type: String },
    sourceUrl: { type: String },
    price: { type: Number, default: 50 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Dataset = mongoose.models.Dataset || mongoose.model<IDataset>('Dataset', DatasetSchema);
