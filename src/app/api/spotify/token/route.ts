import { CLIENT_ID_AND_SECRET, REDIRECT_URI } from '@/app/constants';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const Authorization =
    'Basic ' + Buffer.from(CLIENT_ID_AND_SECRET).toString('base64');

  const body = new URLSearchParams({
    code: code as string,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  }).toString();

  const data = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization,
    },
  }).then((res) => res.json());

  return NextResponse.json(data);
}
