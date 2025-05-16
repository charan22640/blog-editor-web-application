import { FC, useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PencilIcon, Save, Send, Clock } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Define a schema for form validation
const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft')
});

type BlogFormValues = z.infer<typeof blogSchema>;

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
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const changesSinceLastSave = useRef(false);
  
  const { control, handleSubmit, watch, formState: { errors, isDirty, isValid } } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      tags: initialData?.tags || '',
      status: initialData?.status || 'draft'
    },
    mode: 'onChange'
  });
  
  const watchedValues = watch();
  
  // Debounced auto-save with improved UX
  useEffect(() => {
    if (!autoSaveEnabled || !isDirty) return;
    
    changesSinceLastSave.current = true;
    
    const timer = setTimeout(() => {
      if (changesSinceLastSave.current && isValid && watchedValues.title && watchedValues.content) {
        handleAutoSave();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [watchedValues, isDirty, isValid]);

  const handleAutoSave = async () => {
    if (!isValid || !watchedValues.title || !watchedValues.content) return;
    
    try {
      setSaving(true);
      changesSinceLastSave.current = false;
      await onSave({ ...watchedValues, status: 'draft' });
      setLastSaved(new Date());
      toast.success('Draft saved automatically');
    } catch (error) {
      toast.error('Failed to save draft');
      changesSinceLastSave.current = true;
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setSaving(true);
      await onSave({ ...data, status: 'published' });
      setLastSaved(new Date());
      toast.success('Blog published successfully');
      changesSinceLastSave.current = false;
    } catch (error) {
      toast.error('Failed to publish blog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-gray-950 rounded-xl p-6 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PencilIcon className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">{initialData?.id ? 'Edit Blog' : 'Create New Blog'}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <label htmlFor="autosave" className="mr-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              Auto-save
            </label>
            <input
              type="checkbox"
              id="autosave"
              checked={autoSaveEnabled}
              onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          {lastSaved && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
          {saving && <span className="text-xs text-amber-600 animate-pulse">Saving...</span>}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-base font-semibold">Blog Title <span className="text-red-500">*</span></Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="title"
                placeholder="Enter an engaging title"
                className="focus:ring-2 focus:ring-primary/20"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="text-base font-semibold">Content <span className="text-red-500">*</span></Label>
          <div className="min-h-[400px] border rounded-md overflow-hidden">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  theme="snow"
                  value={field.value}
                  onChange={field.onChange}
                  className="h-[350px]"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'color': [] }, { 'background': [] }],
                      ['link', 'image'],
                      ['clean']
                    ],
                  }}
                />
              )}
            />
          </div>
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="text-base font-semibold">Tags (comma-separated)</Label>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="tags"
                placeholder="tech, programming, web development"
                className="focus:ring-2 focus:ring-primary/20"
              />
            )}
          />
        </div>

        <div className="flex items-center justify-between pt-6">
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleAutoSave}
              disabled={saving || !isValid}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
          </div>
          <Button
            type="submit"
            disabled={saving || !isValid}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BlogEditor;
