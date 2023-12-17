import Cookies from 'js-cookie';

export const SPOTIFY_COOKIE_NAME = 'PINNACLE_SPOTIFY_ACCESS_TOKEN';

export const SPOTIFY_TOKEN_COOKIE = Cookies.get(SPOTIFY_COOKIE_NAME) as string;

export const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize?';
export const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL}/callback`;
export const SCOPE =
  'user-read-private user-read-email streaming user-read-playback-state user-modify-playback-state user-read-currently-playing';

export const CLIENT_ID_AND_SECRET = `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`;
