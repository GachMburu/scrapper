import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const datasetId = searchParams.get('datasetId');

  if (!datasetId) {
    return NextResponse.json(
      { error: 'Dataset ID is required' },
      { status: 400 }
    );
  }

  // Simulate payment processing (in real world, integrate with Stripe)
  console.log(`[Mock Payment] Processing payment for dataset: ${datasetId}`);

  // Get the origin from the request headers
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');

  // Redirect back to the dataset page with paid=true flag
  const redirectUrl = `${protocol}://${host}/dataset/${datasetId}?paid=true`;

  return NextResponse.redirect(redirectUrl);
}
