import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { code } = await req.json();
  if (code === process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 401 });
}
