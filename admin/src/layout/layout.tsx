import { Header } from './header';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="w-full max-w-7xl mx-auto flex flex-col">{children}</main>
    </>
  );
}
