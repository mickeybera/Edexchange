import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Listing, User } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected');
    
    const listing = await Listing.findById(params.id)
      .populate('sellerId', 'username firstName lastName profileImage')
      .select('-__v');
    
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Listing fetched:', listing._id);
    return NextResponse.json(listing);
  } catch (error: any) {
    console.error('❌ Error fetching listing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch listing',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if listing exists and belongs to user
    const existingListing = await Listing.findById(params.id);
    if (!existingListing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    if (existingListing.sellerId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only edit your own listings' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    console.log('📝 Updating listing:', params.id, body);
    
    const updatedListing = await Listing.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    )
      .populate('sellerId', 'username firstName lastName profileImage')
      .select('-__v');
    
    console.log('✅ Listing updated successfully:', params.id);
    return NextResponse.json(updatedListing);
  } catch (error: any) {
    console.error('❌ Error updating listing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update listing',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if listing exists and belongs to user
    const listing = await Listing.findById(params.id);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    if (listing.sellerId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized - You can only delete your own listings' },
        { status: 403 }
      );
    }
    
    console.log('🗑️ Deleting listing:', params.id);
    await Listing.findByIdAndDelete(params.id);
    
    console.log('✅ Listing deleted successfully:', params.id);
    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting listing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete listing',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

