import { Art } from './components/art';
import { Logo } from './components/logo';

export default function Home() {
  return (
    <>
      <Logo />
      <main className="flex min-h-screen flex-col items-center justify-center pr-[5%] pl-[5%]">
        <Art />
      </main>
    </>
  );
}
