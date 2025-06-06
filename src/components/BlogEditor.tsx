import { FC, useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PencilIcon, Save, Send, Clock, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/navigation';

const ReactQuill = dynamic(() => import('react-quill').then(mod => {
  if (typeof window !== 'undefined') {
    if (!(window as any).__QUILL_PATCHED__) {
      (window as any).__QUILL_PATCHED__ = true;
    }
  }
  return mod;
}), { 
  ssr: false,
  loading: () => <div className="h-[350px] w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
    <p className="text-gray-500">Loading editor...</p>
  </div>
});

const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters').refine(
    (value) => value.replace(/<[^>]*>/g, '').trim().length > 0,
    'Content cannot be empty'
  ),
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
  onSave: (data: BlogFormValues) => Promise<any>;
}

const BlogEditor: FC<BlogEditorProps> = ({ initialData, onSave }) => {
  const router = useRouter();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [localSaved, setLocalSaved] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const changesSinceLastSave = useRef(false);
  const currentStatus = useRef<'draft' | 'published'>(initialData?.status || 'draft');
  const lastContent = useRef<string>(initialData?.content || '');
  const lastTitle = useRef<string>(initialData?.title || '');

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const { control, handleSubmit, watch, setValue, formState: { errors, isDirty, isValid } } = useForm<BlogFormValues>({
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

  // Online/Offline status and sync
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (localSaved) {
        toast.success('You\'re back online! Syncing changes...');
        syncLocalChanges();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You\'re offline. Changes will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [localSaved]);

  // Auto-save functionality
  useEffect(() => {
    const hasContentChanged = watchedValues.content !== lastContent.current;
    const hasTitleChanged = watchedValues.title !== lastTitle.current;

    // Don't auto-save if disabled or no changes
    if (!autoSaveEnabled || (!hasContentChanged && !hasTitleChanged)) return;

    // Don't auto-save if publishing or already published
    if (isPublishing || currentStatus.current === 'published') return;

    changesSinceLastSave.current = true;
    setErrorMessage(null);

    const timer = setTimeout(() => {
      if (changesSinceLastSave.current && watchedValues.title && watchedValues.content) {
        lastContent.current = watchedValues.content;
        lastTitle.current = watchedValues.title;
        handleAutoSave();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [watchedValues.content, watchedValues.title, isPublishing, autoSaveEnabled]);

  const saveToLocalStorage = (data: BlogFormValues) => {
    try {
      localStorage.setItem('blog_draft', JSON.stringify({
        ...data,
        id: initialData?.id,
        savedAt: new Date().toISOString()
      }));
      setLocalSaved(true);
      setLastSaved(new Date());
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage', error);
      return false;
    }
  };

  const syncLocalChanges = async () => {
    try {
      const localData = localStorage.getItem('blog_draft');
      if (!localData) return;

      const parsedData = JSON.parse(localData);
      await onSave({ ...parsedData, status: 'draft' });
      localStorage.removeItem('blog_draft');
      setLocalSaved(false);
      toast.success('Local changes synced successfully!');
    } catch (error) {
      console.error('Failed to sync local changes', error);
      toast.error('Failed to sync local changes. Will try again later.');
    }
  };

  const handleAutoSave = async () => {
    // Don't auto-save if publishing or already published
    if (!watchedValues.title || !watchedValues.content || isPublishing || currentStatus.current === 'published') return;

    try {
      setSaving(true);
      changesSinceLastSave.current = false;
      setErrorMessage(null);

      if (!isOnline) {
        const saved = saveToLocalStorage(watchedValues);
        if (saved) {
          toast.success('Draft saved locally (offline mode)');
        } else {
          toast.error('Failed to save draft locally');
          changesSinceLastSave.current = true;
        }
        return;
      }

      // Only save as draft if not published
      await onSave({ ...watchedValues, status: 'draft' });
      currentStatus.current = 'draft';
      setLastSaved(new Date());
      toast.success('Draft saved automatically');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`Failed to save draft: ${errorMsg}`);
      toast.error(`Failed to save draft: ${errorMsg}`);
      changesSinceLastSave.current = true;
      saveToLocalStorage(watchedValues);
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    if (!isOnline) {
      toast.error('Cannot publish while offline. Please connect to the internet.');
      return;
    }

    try {
      setIsPublishing(true);
      setSaving(true);
      setErrorMessage(null);

      // Stop auto-save while publishing and mark as published
      changesSinceLastSave.current = false;
      currentStatus.current = 'published';

      const result = await onSave({ ...data, status: 'published' });
      setLastSaved(new Date());
      toast.success('Blog published successfully');

      // Clean up any draft data
      localStorage.removeItem('blog_draft');
      setLocalSaved(false);
      setAutoSaveEnabled(false); // Disable auto-save for published posts

      // Redirect to blog list page
      setTimeout(() => {
        router.push('/blog');
      }, 1500);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`Failed to publish: ${errorMsg}`);
      toast.error(`Failed to publish: ${errorMsg}`);
      setIsPublishing(false);
      currentStatus.current = 'draft'; // Revert to draft state on failure
    } finally {
      setSaving(false);
    }
  };

  // Load draft from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedDraft = localStorage.getItem('blog_draft');
      if (savedDraft && !lastSaved && currentStatus.current !== 'published') {
        const parsedDraft = JSON.parse(savedDraft);
        if (!initialData?.id || parsedDraft.id === initialData.id) {
          toast.info('Restored draft from local storage');
          // @ts-ignore
          Object.entries(parsedDraft).forEach(([key, value]) => {
            if (key !== 'id' && key !== 'savedAt') {
              // @ts-ignore
              setValue(key, value);
            }
          });
          setLocalSaved(true);
          setLastSaved(new Date(parsedDraft.savedAt));
        }
      }
    } catch (error) {
      console.error('Failed to load local draft', error);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-gray-950 rounded-xl p-6 shadow-sm border relative">
      {errorMessage && (
        <div className="absolute top-4 right-4 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-md flex items-center space-x-2 max-w-xs">
          <AlertCircle size={16} />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}

      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center justify-between'} mb-4`}>
        <div className="flex items-center gap-2">
          <PencilIcon className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">{initialData?.id ? 'Edit Blog' : 'Create New Blog'}</h2>
        </div>
        <div className={`flex ${isMobile ? 'mt-3 flex-wrap' : ''} items-center gap-2`}>
          {currentStatus.current !== 'published' && (
            <div className="flex items-center mr-2">
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
          )}
          
          <div className="flex items-center mr-3">
            {isOnline ? (
              <div className="flex items-center text-green-600 dark:text-green-400">
                <Wifi className="h-4 w-4 mr-1" />
                <span className="text-xs">Online</span>
              </div>
            ) : (
              <div className="flex items-center text-amber-600 dark:text-amber-400">
                <WifiOff className="h-4 w-4 mr-1" />
                <span className="text-xs">Offline</span>
              </div>
            )}
          </div>
          {lastSaved && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              Last saved: {lastSaved.toLocaleTimeString()}
              {localSaved && ' (local)'}
            </div>
          )}
          {saving && <span className="text-xs text-amber-600 animate-pulse ml-2">Saving...</span>}
        </div>
      </div>

      <div className="space-y-4 relative">
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
          <div className="min-h-[400px] border rounded-md overflow-hidden relative shimmer-bg">
            <div className="relative z-10">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    className="h-[350px] bg-white/80 dark:bg-gray-950/80"
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
          {currentStatus.current !== 'published' && (
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
          )}
          <Button
            type="submit"
            disabled={saving || !isValid}
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {currentStatus.current === 'published' ? 'Update' : 'Publish'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BlogEditor;
