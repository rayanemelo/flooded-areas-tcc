import { Layout } from '@/layout/layout';

type AdminPrivateLayoutProps = {
  children: React.ReactNode;
};

export default function PrivateLayout({
  children,
}: Readonly<AdminPrivateLayoutProps>) {
  return <Layout>{children}</Layout>;
}
