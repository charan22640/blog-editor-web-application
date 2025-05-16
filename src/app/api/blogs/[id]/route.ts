import { connectToDb } from '@/lib/db';
import { Blog } from '@/lib/models/Blog';
import { getUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDb();
    
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid blog ID format' }, { status: 400 });
    }
    
    const blog = await Blog.findById(params.id).lean();
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    console.error('GET /api/blogs/[id] error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch blog',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid blog ID format' }, { status: 400 });
    }

    await connectToDb();
    const data = await req.json();
    
    if (!data.title || !data.content) {
      return NextResponse.json({ 
        error: 'Title and content are required'
      }, { status: 400 });
    }

    const tags = data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [];
    
    const blog = await Blog.findOneAndUpdate(
      { _id: params.id, userId: user.id },
      { ...data, tags },
      { new: true, runValidators: true }
    ).lean();

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('PUT /api/blogs/[id] error:', error);
    return NextResponse.json({ 
      error: 'Failed to update blog',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
