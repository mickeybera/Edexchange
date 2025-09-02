// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/lib/db';
// import { DonatedItem } from '@/models';
// import { sendBorrowNotification } from '@/lib/email';

// export async function POST(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await dbConnect();
    
//     const body = await request.json();
//     const { borrowerName, borrowerEmail, borrowerPhone } = body;
    
//     // Validate required fields
//     if (!borrowerName) {
//       return NextResponse.json(
//         { error: 'Borrower name is required' },
//         { status: 400 }
//       );
//     }
    
//     const donatedItem = await DonatedItem.findById(params.id);
    
//     if (!donatedItem) {
//       return NextResponse.json(
//         { error: 'Donated item not found' },
//         { status: 404 }
//       );
//     }
    
//     if (!donatedItem.available) {
//       return NextResponse.json(
//         { error: 'Item is not available for borrowing' },
//         { status: 400 }
//       );
//     }
    
//     // Update the item to mark it as borrowed
//     const updatedItem = await DonatedItem.findByIdAndUpdate(
//       params.id,
//       {
//         available: false,
//         borrowedBy: borrowerName,
//         borrowedAt: new Date(),
//       },
//       { new: true }
//     ).select('-__v');
    
//     // Send email notification to donor if email is available
//     if (donatedItem.donorEmail) {
//       try {
//         await sendBorrowNotification(
//           donatedItem.donorEmail,
//           donatedItem.donorName,
//           donatedItem.title,
//           borrowerName,
//           borrowerEmail || 'Not provided'
//         );
//       } catch (emailError) {
//         console.error('Error sending borrow notification email:', emailError);
//         // Don't fail the request if email fails
//       }
//     }
    
//     return NextResponse.json(updatedItem);
//   } catch (error) {
//     console.error('Error borrowing item:', error);
//     return NextResponse.json(
//       { error: 'Failed to borrow item' },
//       { status: 500 }
//     );
//   }
// }



