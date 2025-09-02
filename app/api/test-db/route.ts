import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test database connection
    await dbConnect();
    
    console.log('✅ Database connection successful');
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working!',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ Database test failed:', error);
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

