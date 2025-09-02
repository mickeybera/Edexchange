import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Event } from '@/models';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check if we have any events
    const count = await Event.countDocuments();
    
    if (count === 0) {
      // Add some sample events
      const sampleEvents = [
        {
          title: 'React.js Workshop',
          description: 'Learn the fundamentals of React.js with hands-on projects. Perfect for beginners and intermediate developers.',
          eventDate: new Date('2025-02-15'),
          organizer: 'Tech Club',
          eventLink: 'https://meet.google.com/abc-defg-hij',
          location: 'Computer Lab A',
          time: '14:00',
          category: 'Workshop',
          imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxAttendees: 60,
          currentAttendees: 45,
          status: 'active'
        },
        {
          title: 'Engineering Expo 2025',
          description: 'Annual showcase of student engineering projects. See innovative solutions from our talented students.',
          eventDate: new Date('2025-03-20'),
          organizer: 'Engineering Department',
          eventLink: 'https://engineering-expo-2025.eventbrite.com',
          location: 'Main Auditorium',
          time: '10:00',
          category: 'Exhibition',
          imageUrl: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxAttendees: 500,
          currentAttendees: 234,
          status: 'active'
        },
        {
          title: 'Study Group: Calculus II',
          description: 'Collaborative study session for upcoming midterms. Bring your questions and study materials.',
          eventDate: new Date('2025-02-08'),
          organizer: 'Math Students Association',
          eventLink: 'https://zoom.us/j/123456789',
          location: 'Library Room 205',
          time: '18:00',
          category: 'Study Group',
          imageUrl: 'https://images.pexels.com/photos/6256071/pexels-photo-6256071.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxAttendees: 20,
          currentAttendees: 12,
          status: 'active'
        },
        {
          title: 'Career Fair 2025',
          description: 'Meet with top employers and explore career opportunities. Network with industry professionals.',
          eventDate: new Date('2025-04-12'),
          organizer: 'Career Services',
          eventLink: 'https://career-fair-2025.university.edu',
          location: 'Student Center',
          time: '09:00',
          category: 'Career',
          imageUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxAttendees: 1000,
          currentAttendees: 567,
          status: 'active'
        },
        {
          title: 'Arduino Basics Workshop',
          description: 'Introduction to Arduino programming and electronics. Learn to build your first electronic project.',
          eventDate: new Date('2025-02-25'),
          organizer: 'Robotics Club',
          eventLink: 'https://robotics-club.github.io/arduino-workshop',
          location: 'Electronics Lab',
          time: '15:30',
          category: 'Workshop',
          imageUrl: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxAttendees: 35,
          currentAttendees: 28,
          status: 'active'
        },
        {
          title: 'Student Research Symposium',
          description: 'Presentation of undergraduate research projects. Discover cutting-edge research from your peers.',
          eventDate: new Date('2025-05-18'),
          organizer: 'Research Office',
          eventLink: 'https://research-symposium.university.edu',
          location: 'Science Building',
          time: '13:00',
          category: 'Academic',
          imageUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400',
          maxAttendees: 150,
          currentAttendees: 89,
          status: 'active'
        }
      ];
      
      await Event.insertMany(sampleEvents);
      
      return NextResponse.json({
        message: 'Sample events added successfully',
        count: sampleEvents.length
      });
    }
    
    return NextResponse.json({
      message: 'Database already has events',
      count
    });
  } catch (error) {
    console.error('Error in test route:', error);
    return NextResponse.json(
      { error: 'Failed to test events' },
      { status: 500 }
    );
  }
}



