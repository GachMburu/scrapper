import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Dataset } from '@/lib/models/Dataset';

export const dynamic = 'force-dynamic';
export async function GET() {
  await connectToDatabase();
  const datasets = await Dataset.find({}).sort({ createdAt: -1 });
  return NextResponse.json(datasets);
}
