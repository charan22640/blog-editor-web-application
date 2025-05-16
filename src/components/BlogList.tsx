import { FC, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, EyeIcon, CalendarIcon, TagIcon, FilterIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Blog {
  _id: string;
  title: string;
  content?: string;
  tags?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

interface BlogListProps {
  blogs: Blog[];
  onDelete?: (id: string) => Promise<void>;
}

type SortOption = 'newest' | 'oldest' | 'title';
type FilterOption = 'all' | 'published' | 'draft';

const BlogList: FC<BlogListProps> = ({ blogs, onDelete }) => {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    try {
      setIsDeleting(id);
      await onDelete(id);
      toast.success('Blog deleted successfully');
    } catch (error) {
      toast.error('Failed to delete blog');
    } finally {
      setIsDeleting(null);
    }
  };

  // Sort and filter blogs
  const sortedAndFilteredBlogs = [...blogs]
    .filter(blog => {
      if (filterBy === 'all') return true;
      return blog.status === filterBy;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else { // title
        return a.title.localeCompare(b.title);
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Your Blogs</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
            <Button 
              variant={filterBy === 'all' ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterBy('all')}
              className="text-xs h-8 px-2"
            >
              All
            </Button>
            <Button 
              variant={filterBy === 'published' ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterBy('published')}
              className="text-xs h-8 px-2"
            >
              Published
            </Button>
            <Button 
              variant={filterBy === 'draft' ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterBy('draft')}
              className="text-xs h-8 px-2"
            >
              Drafts
            </Button>
          </div>

          <select 
            className="bg-white dark:bg-gray-950 rounded-md border px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">By title</option>
          </select>

          <Link href="/blog/new">
            <Button size="sm" className="flex items-center gap-1">
              <PlusIcon className="h-4 w-4" /> New Blog
            </Button>
          </Link>
        </div>
      </div>

      {sortedAndFilteredBlogs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No blogs found</p>
          <Link href="/blog/new">
            <Button>
              Create Your First Blog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sortedAndFilteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="flex flex-col h-full bg-white dark:bg-gray-950 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex-1 p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                    {blog.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {format(new Date(blog.updatedAt), 'MMM d, yyyy')}
                  </div>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{blog.title}</h3>
                
                {blog.tags && typeof blog.tags === 'string' && blog.tags.trim() !== '' && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <TagIcon className="h-3 w-3 mr-1" />
                    <div className="flex flex-wrap gap-1">
                      {blog.tags.split(',').map((tag, index) => (
                        <span key={index} className="bg-gray-100 dark:bg-gray-800 rounded-full px-2 py-0.5">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex border-t divide-x">
                <Link href={`/blog/edit/${blog._id}`} className="flex-1">
                  <Button variant="ghost" className="w-full rounded-none flex items-center justify-center py-3 h-auto">
                    <PencilIcon className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    className="flex-1 rounded-none flex items-center justify-center py-3 h-auto text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => handleDelete(blog._id)}
                    disabled={isDeleting === blog._id}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    {isDeleting === blog._id ? 'Deleting...' : 'Delete'}
                  </Button>
                )}
                {blog.status === 'published' && (
                  <Link href={`/blog/view/${blog._id}`} className="flex-1">
                    <Button variant="ghost" className="w-full rounded-none flex items-center justify-center py-3 h-auto">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
