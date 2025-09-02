import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { User } from '@/models';

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
    
    // Check if user already exists
    const existingUser = await User.findOne({ clerkId: userId });
    if (existingUser) {
      console.log('✅ User already exists:', existingUser._id);
      return NextResponse.json(existingUser);
    }
    
    // Get user data from Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json(
        { error: 'User not found in Clerk' },
        { status: 404 }
      );
    }
    
    // Create user profile
    const userData = {
      clerkId: userId,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      username: clerkUser.username || `user_${userId.slice(-6)}`,
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      profileImage: clerkUser.imageUrl || '',
      bio: '',
      location: '',
      website: '',
      socialLinks: {},
      followers: [],
      following: []
    };
    
    console.log('📝 Creating user profile:', userData);
    
    const user = await User.create(userData);
    
    console.log('✅ User created successfully:', user._id);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error setting up user:', error);
    return NextResponse.json(
      { 
        error: 'Failed to setup user',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

