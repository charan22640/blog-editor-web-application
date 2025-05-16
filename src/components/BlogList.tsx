import { FC } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Blog {
  _id: string;
  title: string;
  status: 'draft' | 'published';
  updatedAt: string;
}

interface BlogListProps {
  blogs: Blog[];
}

const BlogList: FC<BlogListProps> = ({ blogs }) => {
  return (
    <div className="space-y-4">
      {blogs.map((blog) => (
        <div
          key={blog._id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <h3 className="font-semibold">{blog.title}</h3>
            <div className="flex space-x-4 text-sm text-gray-500">
              <span>
                {blog.status === 'published' ? '📢 Published' : '📝 Draft'}
              </span>
              <span>
                Last updated: {new Date(blog.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Link href={`/blog/edit/${blog._id}`}>
            <Button variant="outline">Edit</Button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
