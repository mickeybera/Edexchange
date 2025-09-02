import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Listing, User } from '@/models';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Connecting to database...');
    await dbConnect();
    console.log('✅ Database connected');
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'active';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const sellerId = searchParams.get('sellerId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    let query: any = { status };
    
    if (category) {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Handle sellerId parameter
    if (sellerId === 'me') {
      // Get current user's listings
      const { userId } = await auth();
      if (!userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
      
      const user = await User.findOne({ clerkId: userId });
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      
      query.sellerId = user._id;
    } else if (sellerId) {
      // Get listings by specific seller ID
      query.sellerId = sellerId;
    }
    
    console.log('🔍 Fetching listings with query:', query);
    const listings = await Listing.find(query)
      .populate('sellerId', 'username firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await Listing.countDocuments(query);
    console.log(`✅ Found ${listings.length} listings out of ${total} total`);
    
    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('❌ Error fetching listings:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch listings',
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
    
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    console.log('📝 Creating listing with data:', { sellerId: user._id, ...body });
    
    // Handle image URLs - if images are provided as base64 or URLs, they should be processed
    // For now, we'll assume images are already uploaded and URLs are provided
    const listingData = {
      sellerId: user._id,
      ...body,
      // Ensure images is always an array
      images: Array.isArray(body.images) ? body.images : [],
    };
    
    const listing = await Listing.create(listingData);
    
    const populatedListing = await Listing.findById(listing._id)
      .populate('sellerId', 'username firstName lastName profileImage')
      .select('-__v');
    
    console.log('✅ Listing created successfully:', listing._id);
    return NextResponse.json(populatedListing, { status: 201 });
  } catch (error: any) {
    console.error('❌ Error creating listing:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create listing',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
