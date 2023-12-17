import { REDIRECT_URI, SCOPE, SPOTIFY_AUTHORIZE_URL } from '@/app/constants';
import { NextResponse } from 'next/server';

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
