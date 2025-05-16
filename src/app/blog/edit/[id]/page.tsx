'use client';

import { useEffect, useState } from 'react';
import BlogEditor from '@/components/BlogEditor';
import { toast } from 'sonner';

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blogs/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        toast.error('Failed to fetch blog');
      }
    };

    fetchBlog();
  }, [params.id]);

  const handleSave = async (data: any) => {
    try {
      const response = await fetch(`/api/blogs/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog');
      }

      return await response.json();
    } catch (error) {
      toast.error('Failed to update blog');
      throw error;
    }
  };

  if (!blog) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
      <BlogEditor
        initialData={{
          id: blog._id,
          title: blog.title,
          content: blog.content,
          tags: blog.tags.join(', '),
          status: blog.status,
        }}
        onSave={handleSave}
      />
    </div>
  );
}
