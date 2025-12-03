import type { Metadata } from 'next';
import '@/app/css/globals.css';

export const metadata: Metadata = {
  title: 'Mango Range Component',
  description: 'Custom range component assessment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
