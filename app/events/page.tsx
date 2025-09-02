"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import AddEventModal from '@/components/events/add-event-modal';
import { toast } from 'sonner';

const ThreeBackground = dynamic(() => import('@/components/background/three-background'), { 
  ssr: false 
});

interface Event {
  _id: string;
  title: string;
  eventDate: string;
  organizer: string;
  eventLink?: string;
  description?: string;
  location?: string;
  time?: string;
  category?: string;
  imageUrl?: string;
  maxAttendees?: number;
  currentAttendees?: number;
  status: string;
  createdAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (event: Event) => {
    try {
      const response = await fetch(`/api/events/${event._id}/rsvp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to RSVP');
      }

      toast.success(`RSVP confirmed for ${event.title}!`);
      
      // Refresh the events list
      fetchEvents();
    } catch (error) {
      console.error('Error RSVPing to event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to RSVP');
    }
  };

  const handleAddEvent = async (formData: any) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      toast.success('Event created successfully!');
      setIsAddEventModalOpen(false);
      
      // Refresh the events list
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create event');
      throw error;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Workshop': 'bg-blue-500',
      'Exhibition': 'bg-purple-500',
      'Study Group': 'bg-green-500',
      'Career': 'bg-orange-500',
      'Academic': 'bg-red-500',
      'Social': 'bg-pink-500',
      'Sports': 'bg-indigo-500',
      'Cultural': 'bg-yellow-500',
      'Technical': 'bg-gray-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <>
        <ThreeBackground />
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading events...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <ThreeBackground />
      <Navbar />
      
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Campus Events</h1>
                <p className="text-muted-foreground">
                  Discover workshops, study groups, and academic events happening on campus
                </p>
              </div>
              <Button onClick={() => setIsAddEventModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {events.map((event, index) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                className="scroll-range-animation"
              >
                <Card className="group enhanced-card-shadow backdrop-blur-sm bg-background/80 border-border/50 h-full flex flex-col">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={event.imageUrl || 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {event.category && (
                        <Badge 
                          className={`absolute top-2 right-2 ${getCategoryColor(event.category)} text-white`}
                        >
                          {event.category}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 flex-1">
                    <CardTitle className="mb-2 line-clamp-2">{event.title}</CardTitle>
                    {event.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      
                      {event.time && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.currentAttendees || 0}
                          {event.maxAttendees && event.maxAttendees > 0 ? `/${event.maxAttendees}` : ''} attendees
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      Organized by {event.organizer}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0 space-x-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleRSVP(event)}
                      disabled={
                        event.maxAttendees ? (event.currentAttendees || 0) >= event.maxAttendees : false
                      }
                    >
                      {event.maxAttendees && (event.currentAttendees || 0) >= event.maxAttendees 
                        ? 'Event Full' 
                        : 'RSVP'
                      }
                    </Button>
                    {event.eventLink && (
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => window.open(event.eventLink, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {events.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <Calendar className="h-24 w-24 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">No events yet</h2>
              <p className="text-muted-foreground mb-6">
                Be the first to create an event and bring the campus together
              </p>
              <Button onClick={() => setIsAddEventModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Event
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onSubmit={handleAddEvent}
      />

      <Footer />
    </>
  );
}