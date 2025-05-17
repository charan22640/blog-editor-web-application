import { connectToDb } from '@/lib/db';
import { Blog } from '@/lib/models/Blog';
import { getUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Simple in-memory cache for server
const memoryCache: Record<string, { data: any; expires: number }> = {};

function getCachedData(key: string): any | null {
  const item = memoryCache[key];
  if (!item) return null;
  
  if (Date.now() > item.expires) {
    delete memoryCache[key];
    return null;
  }
  
  return item.data;
}

function setCachedData(key: string, data: any, ttlSeconds = 60): void {
  memoryCache[key] = {
    data,
    expires: Date.now() + (ttlSeconds * 1000)
  };
}

function deleteCachedData(key: string): void {
  delete memoryCache[key];
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate blog ID first
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid blog ID format' }, { status: 400 });
    }
    
    // Connect to database with error handling
    try {
      await connectToDb();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 503 });
    }
    
    // Check for the user auth - should verify user can access this blog
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Fetch blog with proper error handling
    const blog = await Blog.findOne({
      _id: params.id,
      userId: user.id // Ensure user only accesses their own blogs
    }).lean();
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('GET /api/blogs/[id] error:', error);
    
    // Provide specific error messages based on error type
    if (error instanceof mongoose.Error) {
      return NextResponse.json({ 
        error: 'Database operation failed',
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch blog',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate blog ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid blog ID format' }, { status: 400 });
    }

    // Connect to database with proper error handling
    try {
      await connectToDb();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 503 });
    }    // First check if the blog exists and belongs to the user
    const blog = await Blog.findOne({
      _id: params.id,
      userId: user.id
    });

    if (!blog) {
      return NextResponse.json({ 
        error: 'Blog not found or you do not have permission to delete it' 
      }, { status: 404 });
    }

    // If blog exists and belongs to user, delete it
    await Blog.findOneAndDelete({
      _id: params.id,
      userId: user.id
    });

    // Invalidate cache after delete
    deleteCachedData(`blogs-${user.id}`);
    deleteCachedData(`blog-${params.id}`);

    return NextResponse.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/blogs/[id] error:', error);
    
    if (error instanceof mongoose.Error) {
      return NextResponse.json({ 
        error: 'Database operation failed',
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to delete blog',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate blog ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid blog ID format' }, { status: 400 });
    }

    // Parse request body with error handling
    let data;
    try {
      data = await req.json();
    } catch (parseError) {
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        details: parseError instanceof Error ? parseError.message : String(parseError)
      }, { status: 400 });
    }
    
    // Validate required fields
    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ 
        error: 'Title is required and cannot be empty'
      }, { status: 400 });
    }
    
    if (!data.content || !data.content.trim()) {
      return NextResponse.json({ 
        error: 'Content is required and cannot be empty'
      }, { status: 400 });
    }

    // Connect to database with proper error handling
    try {
      await connectToDb();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 503 });
    }

    // Process tags with better sanitization
    const tags = Array.isArray(data.tags) 
      ? data.tags.map((tag: string) => tag.trim()).filter(Boolean)
      : typeof data.tags === 'string'
        ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [];
    
    // Limit tags to a reasonable number (e.g., 10)
    const limitedTags = tags.slice(0, 10);
    
    try {
      // Update blog with optimistic updates
      const blog = await Blog.findOneAndUpdate(
        { _id: params.id, userId: user.id },
        { 
          title: data.title.trim(),
          content: data.content,
          status: data.status || 'draft',
          tags: limitedTags
        },
        { new: true, runValidators: true }
      ).lean();

      if (!blog) {
        return NextResponse.json({ error: 'Blog not found or you do not have permission to edit it' }, { status: 404 });
      }

      // Invalidate cache after update
      deleteCachedData(`blogs-${user.id}`);
      // Also delete the specific blog cache
      deleteCachedData(`blog-${params.id}`);

      return NextResponse.json(blog);
    } catch (dbError) {
      if (dbError instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ 
          error: 'Invalid blog data format',
          details: dbError.message
        }, { status: 400 });
      }
      throw dbError;
    }
  } catch (error) {
    console.error('PUT /api/blogs/[id] error:', error);
    return NextResponse.json({ 
      error: 'Failed to update blog',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
