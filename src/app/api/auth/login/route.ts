import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user";
import dbConnect from "@/lib/db";
import { generateToken } from "@/lib/auth/utils";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    await dbConnect();

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create sanitized user object without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Generate token
    const token = await generateToken({
      userId: user._id.toString(),
      role: user.role
    });

    const response = NextResponse.json({ 
      user: userWithoutPassword,
      token 
    }, { status: 200 });

    // Get the host from the request for dynamic cookie domain
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    
    // Update cookie settings for Kubernetes compatibility
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: isLocalhost ? 'lax' : 'none',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    // Also set a non-httpOnly cookie for client-side access
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: isLocalhost ? 'lax' : 'none',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    // Add CORS headers - use the origin from the request if available
    const origin = request.headers.get('origin');
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const response = new NextResponse(null, { status: 204 });
  
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }
  
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
