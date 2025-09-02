import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected');
    
    const { searchParams } = new URL(request.url);
    const clerkId = searchParams.get('clerkId');
    const username = searchParams.get('username');
    
    let query = {};
    
    if (clerkId) {
      query = { clerkId };
    } else if (username) {
      query = { username };
    }
    
    console.log('🔍 Fetching users with query:', query);
    const users = await User.find(query).select('-__v');
    console.log(`✅ Found ${users.length} users`);
    
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch users',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('🔍 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected');
    
    const body = await request.json();
    console.log('📝 Creating user with data:', { clerkId: userId, ...body });
    
    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
      console.log('⚠️ User already exists');
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    
    const user = await User.create({
      clerkId: userId,
      ...body,
    });
    
    console.log('✅ User created successfully:', user._id);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error creating user:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create user',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
