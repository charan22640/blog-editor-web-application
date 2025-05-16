import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ 
      message: 'Logged out successfully' 
    });

    // Clear the token cookie
    response.cookies.set({
      name: 'token',
      value: '',
      expires: new Date(0), // Immediate expiration
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      error: 'Logout failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
