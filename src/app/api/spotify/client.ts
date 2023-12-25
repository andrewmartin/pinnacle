import { SPOTIFY_COOKIE_NAME, SPOTIFY_TOKEN_COOKIE } from '@/app/constants';
import { AccessToken, SpotifyApi } from '@spotify/web-api-ts-sdk';
import Cookies from 'js-cookie';

const refreshAccessToken = async (accessToken: AccessToken): Promise<void> => {
  if (!accessToken?.refresh_token) {
    return;
  }

  try {
    const currentTime = new Date().getTime();
    const milliseconds = (accessToken?.expires as number) - currentTime;
    const minutes = milliseconds / 60000;

    if (minutes < 10) {
      console.log('minutes less than 10, will refresh');
      const token = await fetch(
        `/api/spotify/token/refresh?refreshToken=${accessToken.refresh_token}`
      ).then((res) => res.json());

      if (token?.access_token) {
        const newCookieValue = {
          ...accessToken,
          ...token,
        };
        console.log('newCookieValue', newCookieValue);
        Cookies.set(SPOTIFY_COOKIE_NAME, btoa(JSON.stringify(newCookieValue)));
      }
    }
  } catch (error) {
    // noop
    return;
  }
};

export const spotifyClient = (accessToken: AccessToken) => {
  const sdk = SpotifyApi.withAccessToken(
    process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
    accessToken
  );

  return sdk;
};

export const spotifyClientBrowser = (encodedToken: string) => {
  const accessToken = JSON.parse(atob(encodedToken)) as AccessToken;
  const client = spotifyClient(accessToken);
  refreshAccessToken(accessToken);

  return client;
};

export type SpotifyClient = ReturnType<typeof spotify>;

export const spotify = (client: SpotifyApi) => {
  return {
    queue: async () => await client.player.getUsersQueue(),
    next: async () => await client.player.skipToNext(''),
    previous: async () => await client.player.skipToPrevious(''),
    pause: async () => await client.player.pausePlayback(''),
    resume: async () => await client.player.startResumePlayback(''),
    playTrack: async (uri: string) => {
      await client.player.skipToNext('');
      await client.player.addItemToPlaybackQueue(uri);
      await client.player.skipToNext('');
    },
    skipAhead: async (tracksToSkip: number) => {
      for (let index = 0; index < tracksToSkip; index++) {
        await client.player.skipToNext('');
      }
    },
    isPlaying: async () => {
      const playbackState = await client.player.getPlaybackState();
      return playbackState?.is_playing;
    },
  };
};
