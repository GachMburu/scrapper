import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, datasetId } = body;

    if (!email || !datasetId) {
      return NextResponse.json(
        { error: 'Email and datasetId are required' },
        { status: 400 }
      );
    }

    // Mock email delivery - just log to console
    console.log(`[Mock Emailer] Sending dataset ${datasetId} to ${email}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json(
      { success: true, message: `Email sent to ${email}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in send-mail route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
