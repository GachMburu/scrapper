import mongoose, { Schema, Document } from 'mongoose';

export interface IDataRow extends Document {
  datasetId: mongoose.Types.ObjectId;
  content: Record<string, any>;
  createdAt: Date;
}

const DataRowSchema = new Schema<IDataRow>(
  {
    datasetId: { type: Schema.Types.ObjectId, ref: 'Dataset', required: true },
    content: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const DataRow = mongoose.models.DataRow || mongoose.model<IDataRow>('DataRow', DataRowSchema);
