import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { DonatedItem } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const available = searchParams.get('available');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    let query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    if (available !== null) {
      query.available = available === 'true';
    }
    
    const donatedItems = await DonatedItem.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await DonatedItem.countDocuments(query);
    
    return NextResponse.json({
      donatedItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching donated items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donated items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'condition', 'donorName'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    const donatedItem = await DonatedItem.create({
      ...body,
      available: true,
    });
    
    const populatedItem = await DonatedItem.findById(donatedItem._id)
      .select('-__v');
    
    return NextResponse.json(populatedItem, { status: 201 });
  } catch (error) {
    console.error('Error creating donated item:', error);
    return NextResponse.json(
      { error: 'Failed to create donated item' },
      { status: 500 }
    );
  }
}



