import { NextResponse } from 'next/server';
import { scrapeUrl } from '@/lib/scraper';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const data = await scrapeUrl(url);

    // Return the data to the frontend (Admin) to review/edit
    return NextResponse.json({ success: true, data });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to scrape URL' }, { status: 500 });
  }
}
