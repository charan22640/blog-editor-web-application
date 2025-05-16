import { connectToDb } from '@/lib/db';
import { Blog } from '@/lib/models/Blog';
import { getUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDb();
    const blogs = await Blog.find({ userId: user.id })
      .sort({ updatedAt: -1 })
      .lean();
    return NextResponse.json(blogs);
  } catch (error) {
    console.error('GET /api/blogs error:', error);
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
    
    await connectToDb();
    const data = await req.json();
    
    if (!data.title || !data.content) {
      return NextResponse.json({ 
        error: 'Title and content are required'
      }, { status: 400 });
    }

    const tags = data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [];
    
    const blog = await Blog.create({
      ...data,
      userId: user.id,
      tags
    });
    
    return NextResponse.json(blog);
  } catch (error) {
    console.error('POST /api/blogs error:', error);
    return NextResponse.json({ 
      error: 'Failed to create blog',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
