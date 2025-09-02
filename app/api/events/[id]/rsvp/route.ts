import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Event } from '@/models';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    
    const event = await Event.findById(params.id);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }
    
    if (event.status !== 'active') {
      return NextResponse.json(
        { error: 'Event is not active' },
        { status: 400 }
      );
    }
    
    // Check if event is full
    if (event.maxAttendees > 0 && event.currentAttendees >= event.maxAttendees) {
      return NextResponse.json(
        { error: 'Event is full' },
        { status: 400 }
      );
    }
    
    // Increment current attendees
    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      {
        $inc: { currentAttendees: 1 }
      },
      { new: true }
    ).select('-__v');
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Error RSVPing to event:', error);
    return NextResponse.json(
      { error: 'Failed to RSVP to event' },
      { status: 500 }
    );
  }
}



