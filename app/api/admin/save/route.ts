import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Dataset } from '@/lib/models/Dataset';
import { DataRow } from '@/lib/models/DataRow';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { name, description, sourceUrl, dataRows } = body;

    if (!name || !dataRows || !Array.isArray(dataRows)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Create Dataset
    const newDataset = await Dataset.create({
      name,
      description,
      sourceUrl,
    });

    // Create DataRows associated with the dataset
    if (dataRows.length > 0) {
      await DataRow.insertMany(
        dataRows.map((row: any) => ({
          datasetId: newDataset._id,
          content: row,
        }))
      );
    }

    return NextResponse.json({ success: true, datasetId: newDataset._id });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: 'Failed to save dataset' }, { status: 500 });
  }
}
