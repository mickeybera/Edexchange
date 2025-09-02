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
      .populate('reviews.userId', 'username firstName lastName profileImage')
      .select('reviews averageRating totalRatings');
    
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Reviews fetched for listing:', params.id);
    return NextResponse.json({
      reviews: listing.reviews,
      averageRating: listing.averageRating,
      totalRatings: listing.totalRatings,
    });
  } catch (error: any) {
    console.error('❌ Error fetching reviews:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch reviews',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(
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
    
    const listing = await Listing.findById(params.id);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    // Check if user already reviewed this listing
    const existingReview = listing.reviews.find(
      review => review.userId.toString() === user._id.toString()
    );
    
    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this listing' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { rating, comment } = body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Add review
    const newReview = {
      userId: user._id,
      rating,
      comment: comment || '',
      createdAt: new Date(),
    };
    
    listing.reviews.push(newReview);
    
    // Update average rating
    await listing.updateAverageRating();
    
    console.log('✅ Review added successfully for listing:', params.id);
    
    // Return updated listing with populated reviews
    const updatedListing = await Listing.findById(params.id)
      .populate('reviews.userId', 'username firstName lastName profileImage')
      .select('reviews averageRating totalRatings');
    
    return NextResponse.json(updatedListing, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error adding review:', error);
    return NextResponse.json(
      { 
        error: 'Failed to add review',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

