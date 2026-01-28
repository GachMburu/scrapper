import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  description: string;
  content: string; // HTML content from WYSIWYG editor
  categories: string[];
  tags: string[];
  publishedAt?: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    categories: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    publishedAt: { type: Date },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
