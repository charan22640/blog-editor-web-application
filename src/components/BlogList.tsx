import { FC, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, EyeIcon, CalendarIcon, TagIcon, FilterIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { format } from 'date-fns';
import { staggerContainer, cardTransition } from '@/lib/animations';
import { toast } from 'sonner';

interface Blog {
  _id: string;
  title: string;
  content?: string;
  tags?: string | string[];
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    
    setIsDeleting(id);
    try {
      await onDelete(id);
      toast.success('Blog post deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete blog post';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(null);
    }
  };

  // Memoize the filtered and sorted blogs
  const filteredAndSortedBlogs = useMemo(() => {
    return [...blogs]
      .filter(blog => {
        const matchesFilter = filterBy === 'all' || blog.status === filterBy;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = searchQuery === '' || 
          blog.title.toLowerCase().includes(searchLower) ||
          (blog.tags && (
            Array.isArray(blog.tags)
              ? blog.tags.some(tag => tag.toLowerCase().includes(searchLower))
              : blog.tags.toLowerCase().includes(searchLower)
          ));
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        const aTime = sortBy !== 'title' ? new Date(a.createdAt).getTime() : 0;
        const bTime = sortBy !== 'title' ? new Date(b.createdAt).getTime() : 0;
        
        switch (sortBy) {
          case 'newest':
            return bTime - aTime;
          case 'oldest':
            return aTime - bTime;
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [blogs, filterBy, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center pb-6 border-b">
        <h2 className="text-2xl font-semibold">Your Blog Posts</h2>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blogs..."
            aria-label="Search blogs"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
          <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value as FilterOption)}
          aria-label="Filter blog posts"
          className="rounded-lg border border-gray-200 dark:border-gray-700 py-2 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          aria-label="Sort blog posts"
          className="rounded-lg border border-gray-200 dark:border-gray-700 py-2 px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      {/* Blog Grid */}      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
      >
        {filteredAndSortedBlogs.map((blog) => (
          <motion.div
            key={blog._id}
            variants={cardTransition}
            className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={`/blog/edit/${blog._id}`}>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" aria-label="Edit blog post">
                  <PencilIcon className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 w-8 p-0 ${
                  isDeleting === blog._id
                    ? 'cursor-not-allowed opacity-50'
                    : 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
                onClick={() => handleDelete(blog._id)}
                disabled={isDeleting === blog._id}
                aria-label="Delete blog post"
              >
                {isDeleting === blog._id ? (
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <TrashIcon className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${blog.status === 'published' 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}
                >
                  {blog.status === 'published' ? 'Published' : 'Draft'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(blog.updatedAt), 'MMM d, yyyy')}
                </span>
              </div>

              <Link href={`/blog/edit/${blog._id}`} className="block">
                <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {blog.title}
                </h3>
              </Link>              {blog.content && (
                <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                  {blog.content.replace(/<[^>]*>/g, '')}
                </p>
              )}
              
              {blog.tags && (
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(blog.tags) ? blog.tags : blog.tags.split(','))
                    .map((tag, index) => (
                      <span 
                        key={index}                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40 transition-colors"
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag.trim()}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredAndSortedBlogs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <PencilIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery 
              ? "No posts match your search criteria" 
              : "Start writing your first blog post"}
          </p>
          <Link href="/blog/new">
            <Button>
              Create New Post
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default BlogList;
