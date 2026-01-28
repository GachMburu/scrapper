import { connectToDatabase } from '@/lib/db';
import { BlogPost } from '@/lib/models/BlogPost';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  await connectToDatabase();
  const posts = await BlogPost.find({}).sort({ createdAt: -1 });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  const { title, slug, description, content, categories, tags } = await request.json();

  const post = new BlogPost({
    title,
    slug,
    description,
    content,
    categories,
    tags,
    isPublished: false,
  });

  await post.save();
  return NextResponse.json(post);
}
