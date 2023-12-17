'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AccessToken } from '@spotify/web-api-ts-sdk';
import Cookies from 'js-cookie';
import { SPOTIFY_COOKIE_NAME } from '../constants';

const fetchAccessToken = async (code: string): Promise<AccessToken> => {
  const data = await fetch(`/api/spotify/token?code=${code}`).then((res) =>
    res.json()
  );
  return data;
};

export default function Callback({
  searchParams,
}: {
  searchParams: { code: string; state: string };
}) {
  const [serverError, setServerError] = useState('');
  const { push } = useRouter();
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current === false) {
      isLoaded.current = true;
      fetchAccessToken(searchParams.code).then((token) => {
        if (!token?.access_token) {
          console.log(token);
          setServerError('Error getting token, please try logging in again.');
        } else {
          Cookies.set(SPOTIFY_COOKIE_NAME, btoa(JSON.stringify(token)));
          push('/');
        }
      });
    }
  }, [push, searchParams.code]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center pr-[5%] pl-[5%] bg-black">
      {serverError ? (
        <button
          onClick={() => {
            push('/login');
          }}
        >
          {serverError}
        </button>
      ) : (
        'Loading...'
      )}
    </main>
  );
}
