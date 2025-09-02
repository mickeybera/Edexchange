import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/db';
import { Listing, User } from '@/models';
import { sendPurchaseNotification, sendBuyerConfirmation } from '@/lib/email';

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

    await dbConnect();
    
    const body = await request.json();
    const { buyerName, buyerEmail, buyerPhone } = body;
    
    // Validate required fields
    if (!buyerName || !buyerEmail) {
      return NextResponse.json(
        { error: 'Buyer name and email are required' },
        { status: 400 }
      );
    }
    
    // Get the listing
    const listing = await Listing.findById(params.id).populate('sellerId');
    
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    if (listing.status !== 'active') {
      return NextResponse.json(
        { error: 'Item is not available for purchase' },
        { status: 400 }
      );
    }
    
    // Get buyer user info
    const buyer = await User.findOne({ clerkId: userId });
    if (!buyer) {
      return NextResponse.json(
        { error: 'Buyer not found' },
        { status: 404 }
      );
    }
    
    // Update the listing to mark it as sold
    const updatedListing = await Listing.findByIdAndUpdate(
      params.id,
      {
        status: 'sold',
      },
      { new: true }
    ).populate('sellerId').select('-__v');
    
    // Send email notifications
    try {
      // Send notification to seller
      if (listing.sellerId && typeof listing.sellerId === 'object' && 'email' in listing.sellerId) {
        const seller = listing.sellerId as any;
        await sendPurchaseNotification(
          seller.email,
          `${seller.firstName} ${seller.lastName}`,
          listing.title,
          buyerName,
          buyerEmail,
          listing.price
        );
      }
      
      // Send confirmation to buyer
      await sendBuyerConfirmation(
        buyerEmail,
        buyerName,
        listing.title,
        listing.sellerId && typeof listing.sellerId === 'object' && 'firstName' in listing.sellerId 
          ? `${listing.sellerId.firstName} ${listing.sellerId.lastName}`
          : 'Seller',
        listing.sellerId && typeof listing.sellerId === 'object' && 'email' in listing.sellerId
          ? listing.sellerId.email
          : 'No email provided',
        listing.price
      );
    } catch (emailError) {
      console.error('Error sending purchase notification emails:', emailError);
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({
      success: true,
      listing: updatedListing,
      message: 'Purchase completed successfully. Check your email for confirmation.',
    });
    
  } catch (error: any) {
    console.error('Error processing purchase:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process purchase',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
