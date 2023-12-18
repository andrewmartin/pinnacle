import { Art } from './components/art';
import { Logo } from './components/logo';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { SPOTIFY_COOKIE_NAME } from './constants';

export default function Home() {
  const cookieStore = cookies();
  const cookie = cookieStore.get(SPOTIFY_COOKIE_NAME);
  if (!cookie?.value) {
    return redirect('/api/spotify/login');
  }
  return (
    <>
      <Logo />
      <main className="flex min-h-screen flex-col items-center justify-center pr-[5%] pl-[5%]">
        <Art />
      </main>
    </>
  );
}
