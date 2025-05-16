'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
        <h1 className="text-5xl font-bold">Welcome to Blog Editor</h1>
        <p className="text-xl text-gray-600">
          Create, edit, and manage your blog posts with our powerful editor.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/blog">
            <Button size="lg">View My Blogs</Button>
          </Link>
          <Link href="/blog/new">
            <Button variant="outline" size="lg">Create New Blog</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
