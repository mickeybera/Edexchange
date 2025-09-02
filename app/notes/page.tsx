"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Download, FileText, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

const ThreeBackground = dynamic(() => import('@/components/background/three-background'), { 
  ssr: false 
});

// Mock data for notes
const mockNotes = [
  {
    id: '1',
    title: 'Data Structures and Algorithms',
    subject: 'Computer Science',
    author: 'Sarah Johnson',
    rating: 4.8,
    downloads: 245,
    fileType: 'PDF',
    pages: 87,
    image: 'https://images.pexels.com/photos/6353849/pexels-photo-6353849.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'Organic Chemistry Reactions',
    subject: 'Chemistry',
    author: 'Mike Wilson',
    rating: 4.6,
    downloads: 189,
    fileType: 'PDF',
    pages: 124,
    image: 'https://images.pexels.com/photos/1143754/pexels-photo-1143754.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'Calculus Integration Formulas',
    subject: 'Mathematics',
    author: 'Emily Davis',
    rating: 4.9,
    downloads: 367,
    fileType: 'PDF',
    pages: 45,
    image: 'https://images.pexels.com/photos/6256071/pexels-photo-6256071.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    title: 'Physics Mechanics Notes',
    subject: 'Physics',
    author: 'David Brown',
    rating: 4.7,
    downloads: 298,
    fileType: 'PDF',
    pages: 156,
    image: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    title: 'Software Engineering Principles',
    subject: 'Computer Science',
    author: 'Lisa Anderson',
    rating: 4.5,
    downloads: 176,
    fileType: 'PDF',
    pages: 93,
    image: 'https://images.pexels.com/photos/1181373/pexels-photo-1181373.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    title: 'Circuit Analysis Methods',
    subject: 'Electrical Engineering',
    author: 'Robert Chen',
    rating: 4.8,
    downloads: 234,
    fileType: 'PDF',
    pages: 78,
    image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

export default function NotesPage() {
  const handleDownload = (note: any) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading ${note.title}`);
  };

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
            <h1 className="text-3xl font-bold mb-2">Study Notes</h1>
            <p className="text-muted-foreground">
              Access high-quality study materials shared by students
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {mockNotes.map((note, index) => (
              <motion.div
                key={note.id}
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
                        src={note.image}
                        alt={note.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge 
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                        variant="secondary"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        {note.fileType}
                      </Badge>
                      <Badge 
                        className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
                        variant="outline"
                      >
                        {note.subject}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 flex-1">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {note.title}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{note.author}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{note.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {note.pages} pages
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {note.downloads} downloads
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full" 
                      onClick={() => handleDownload(note)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}