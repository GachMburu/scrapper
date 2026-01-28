import { connectToDatabase } from '@/lib/db';
import { BlogPost } from '@/lib/models/BlogPost';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const postId = new mongoose.Types.ObjectId(id);
  const post = await BlogPost.findById(postId);
  
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const postId = new mongoose.Types.ObjectId(id);
  const { title, slug, description, content, categories, tags, isPublished } = await request.json();

  const post = await BlogPost.findByIdAndUpdate(
    postId,
    {
      title,
      slug,
      description,
      content,
      categories,
      tags,
      isPublished,
      publishedAt: isPublished ? new Date() : undefined,
    },
    { new: true }
  );

  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectToDatabase();
  const postId = new mongoose.Types.ObjectId(id);
  
  await BlogPost.findByIdAndDelete(postId);
  return NextResponse.json({ success: true });
}
