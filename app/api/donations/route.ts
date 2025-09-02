import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Donation, User } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const donorId = searchParams.get('donorId');
    const recipientId = searchParams.get('recipientId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    let query: any = {};
    
    if (donorId) {
      query.donorId = donorId;
    }
    
    if (recipientId) {
      query.recipientId = recipientId;
    }
    
    if (status) {
      query.status = status;
    }
    
    const donations = await Donation.find(query)
      .populate('donorId', 'username firstName lastName profileImage')
      .populate('recipientId', 'username firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');
    
    const total = await Donation.countDocuments(query);
    
    return NextResponse.json({
      donations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
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
    
    await dbConnect();
    
    const donor = await User.findOne({ clerkId: userId });
    if (!donor) {
      return NextResponse.json(
        { error: 'Donor not found' },
        { status: 404 }
      );
    }
    
    const body = await request.json();
    
    // Verify recipient exists
    const recipient = await User.findById(body.recipientId);
    if (!recipient) {
      return NextResponse.json(
        { error: 'Recipient not found' },
        { status: 404 }
      );
    }
    
    const donation = await Donation.create({
      donorId: donor._id,
      ...body,
    });
    
    const populatedDonation = await Donation.findById(donation._id)
      .populate('donorId', 'username firstName lastName profileImage')
      .populate('recipientId', 'username firstName lastName profileImage')
      .select('-__v');
    
    return NextResponse.json(populatedDonation, { status: 201 });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}

