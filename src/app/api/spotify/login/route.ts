import { NextResponse } from 'next/server';

const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize?';
export const REDIRECT_URI = 'http://localhost:3000/callback';
export const SCOPE =
  'user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state user-read-currently-playing';

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET(request: Request) {
  const paramsObj = {
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
    show_dialog: 'true',
    // state: generateRandomString(),
  };
  const searchParams = new URLSearchParams(paramsObj);

  const redirectURI = `${SPOTIFY_AUTHORIZE_URL}${searchParams.toString()}`;

  return NextResponse.redirect(redirectURI);
}
