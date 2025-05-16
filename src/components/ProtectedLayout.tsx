'use client';

import { usePathname } from 'next/navigation';
import Navigation from '@/components/Navigation';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const publicPaths = ['/', '/login', '/signup'];
  const isPublicPath = publicPaths.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!isPublicPath && <Navigation />}
      <main className={`flex-1 ${isPublicPath ? '' : 'pt-16'}`}>
        {children}
      </main>
    </div>
  );
}
