import Cookies from 'js-cookie';

export const SHOPIFY_COOKIE_NAME = 'PINNACLE_SPOTIFY_ACCESS_TOKEN';

export const SHOPIFY_TOKEN_COOKIE = Cookies.get(SHOPIFY_COOKIE_NAME) as string;
