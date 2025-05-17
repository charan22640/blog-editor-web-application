'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BlogList from '@/components/BlogList';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        toast.error('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle blog deletion
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to delete blog: ${response.statusText}`);
      }

      // Update the blogs list by removing the deleted blog
      setBlogs(blogs.filter((blog: any) => blog._id !== id));
      toast.success('Blog deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete blog');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Blogs</h1>
        <Link href="/blog/new">
          <Button>Create New Blog</Button>
        </Link>
      </div>
      <BlogList blogs={blogs} onDelete={handleDelete} />
    </div>
  );
}
