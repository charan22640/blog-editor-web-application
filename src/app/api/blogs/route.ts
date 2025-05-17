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

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    
    
    // Add a URL param to bust cache if needed
    const url = new URL(req.url);
    const forceFresh = url.searchParams.get('fresh') === 'true';
    
    // Cache handling with improved invalidation strategy
    const cacheKey = `blogs-${user.id}`;
    
    // Use memory cache instead of browser cache API
    if (!forceFresh) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
          }
        });
      }
    }
    
    // Create DB connection before starting any DB operations
    try {
      await connectToDb();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 503 });
    }
    
    // Optimize query with lean() and limit projection to needed fields only
    const blogs = await Blog.find({ userId: user.id }, {
      _id: 1,
      title: 1,
      content: { $substr: ['$content', 0, 150] }, // Only fetch preview of content
      tags: 1,
      status: 1,
      createdAt: 1,
      updatedAt: 1
    })
      .sort({ updatedAt: -1 })
      .lean();
    
    // Store in memory cache and return response
    setCachedData(cacheKey, blogs, 60); // Cache for 60 seconds
    
    return NextResponse.json(blogs, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (error) {
    console.error('GET /api/blogs error:', error);
    
    // Provide more specific error messages for different failure types
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ 
        error: 'Invalid blog data format',
        details: error.message
      }, { status: 400 });
    } else if (error instanceof mongoose.Error) {
      return NextResponse.json({ 
        error: 'Database operation failed',
        details: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Failed to fetch blogs',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
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
    
    // Process tags properly with better sanitization
    const tags = Array.isArray(data.tags) 
      ? data.tags.map((tag: string) => tag.trim()).filter(Boolean)
      : typeof data.tags === 'string'
        ? data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        : [];
    
    // Limit tags to a reasonable number (e.g., 10)
    const limitedTags = tags.slice(0, 10);
    
    // Create DB connection with proper error handling
    try {
      await connectToDb();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : String(dbError)
      }, { status: 503 });
    }
    
    try {
      // Create blog with properly formatted data
      const blog = await Blog.create({
        title: data.title.trim(),
        content: data.content,
        status: data.status || 'draft',
        userId: user.id,
        tags: limitedTags
      });
      
      // Invalidate cache after creating new blog
      deleteCachedData(`blogs-${user.id}`);

      
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
    console.error('POST /api/blogs error:', error);
    return NextResponse.json({ 
      error: 'Failed to create blog',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
