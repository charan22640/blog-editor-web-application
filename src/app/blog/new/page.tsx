'use client';

import BlogEditor from '@/components/BlogEditor';
import { toast } from 'sonner';

export default function NewBlogPage() {
  const handleSave = async (data: any) => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save blog');
      }

      return await response.json();
    } catch (error) {
      toast.error('Failed to save blog');
      throw error;
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
      <BlogEditor onSave={handleSave} />
    </div>
  );
}
