import { NextRequest, NextResponse } from 'next/server';
const CLIENT_ID_AND_SECRET = `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const refreshToken = request.nextUrl.searchParams.get('refreshToken');
  const Authorization =
    'Basic ' + Buffer.from(CLIENT_ID_AND_SECRET).toString('base64');

  const body = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
    refresh_token: refreshToken as string,
    grant_type: 'refresh_token',
    cache: 'no-cache',
  }).toString();

  const data = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body,
    headers: {
      Authorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error('error', error);
    });

  return NextResponse.json(data);
}
