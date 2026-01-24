import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Dataset } from '@/lib/models/Dataset';
import { DataRow } from '@/lib/models/DataRow';

// GET: Fetch full dataset for editing
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const dataset = await Dataset.findById(id);
  if (!dataset) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  const rows = await DataRow.find({ datasetId: id });

  return NextResponse.json({ dataset, rows });
}

// PUT: Update dataset (Full Overwrite of rows)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const body = await req.json();
  const { name, dataRows } = body;

  // 1. Update Metadata
  await Dataset.findByIdAndUpdate(id, { name });

  // 2. Overwrite Rows (Delete old, Insert new) - Simplest strategy for Deep Editing
  await DataRow.deleteMany({ datasetId: id });
  
  const newRows = dataRows.map((row: any) => ({
    datasetId: id,
    content: row
  }));
  await DataRow.insertMany(newRows);


  return NextResponse.json({ success: true });
}

// DELETE: Remove dataset
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  await DataRow.deleteMany({ datasetId: id });
  await Dataset.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
