import { FC, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface BlogEditorProps {
  initialData?: {
    id?: string;
    title: string;
    content: string;
    tags: string;
    status: 'draft' | 'published';
  };
  onSave: (data: any) => Promise<void>;
}

const BlogEditor: FC<BlogEditorProps> = ({ initialData, onSave }) => {
  const [blog, setBlog] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    tags: initialData?.tags || '',
    status: initialData?.status || 'draft'
  });
  const [saving, setSaving] = useState(false);

  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      handleAutoSave();
    }, 5000);

    return () => clearTimeout(timer);
  }, [blog]);

  const handleAutoSave = async () => {
    if (!blog.title || !blog.content) return;
    
    try {
      setSaving(true);
      await onSave({ ...blog, status: 'draft' });
      toast.success('Draft saved automatically');
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!blog.title || !blog.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      await onSave({ ...blog, status: 'published' });
      toast.success('Blog published successfully');
    } catch (error) {
      toast.error('Failed to publish blog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          placeholder="Enter blog title"
        />
      </div>

      <div className="space-y-2">
        <Label>Content</Label>
        <div className="min-h-[400px]">
          <ReactQuill
            theme="snow"
            value={blog.content}
            onChange={(content) => setBlog({ ...blog, content })}
            className="h-[350px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={blog.tags}
          onChange={(e) => setBlog({ ...blog, tags: e.target.value })}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div className="flex space-x-4">
        <Button
          variant="outline"
          onClick={handleAutoSave}
          disabled={saving}
        >
          Save Draft
        </Button>
        <Button
          onClick={handlePublish}
          disabled={saving}
        >
          Publish
        </Button>
      </div>
    </div>
  );
};

export default BlogEditor;
