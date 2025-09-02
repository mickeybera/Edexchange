"use client";

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Edit, Mail, Calendar, Package, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { useUser, SignInButton } from '@clerk/nextjs';

const ThreeBackground = dynamic(() => import('@/components/background/three-background'), { 
  ssr: false 
});

// Mock user listings
const mockListings = [
  {
    id: '1',
    title: 'Engineering Mathematics Textbook',
    price: 45,
    image: 'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=400',
    condition: 'Like New',
    category: 'Books',
    status: 'Active',
    views: 23,
    likes: 5
  },
  {
    id: '2',
    title: 'Data Structures Notes',
    price: 15,
    image: 'https://images.pexels.com/photos/6353849/pexels-photo-6353849.jpeg?auto=compress&cs=tinysrgb&w=400',
    condition: 'Good',
    category: 'Notes',
    status: 'Sold',
    views: 45,
    likes: 12
  }
];

export default function ProfilePage() {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <>
        <ThreeBackground />
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!isSignedIn) {
    return (
      <>
        <ThreeBackground />
        <Navbar />
        <main className="min-h-screen pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
              <p className="text-muted-foreground mb-6">
                Sign in to access your profile, listings, and account settings.
              </p>
              <SignInButton mode="modal">
                <Button size="lg">Sign In</Button>
              </SignInButton>
            </motion.div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="backdrop-blur-sm bg-background/80">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img
                      src={user?.imageUrl || '/default-avatar.png'}
                      alt={user?.fullName || 'User'}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h1 className="text-2xl font-bold">{user?.fullName || 'User'}</h1>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{user?.primaryEmailAddress?.emailAddress}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">12</div>
                        <div className="text-xs text-muted-foreground">Items Listed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">8</div>
                        <div className="text-xs text-muted-foreground">Items Sold</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">4.8</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="listings">My Listings</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="listings" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockListings.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="backdrop-blur-sm bg-background/80">
                        <CardHeader className="p-0">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-32 object-cover"
                            />
                            <Badge 
                              className={`absolute top-2 right-2 ${
                                item.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                              }`}
                            >
                              {item.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2 line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl font-bold">₹{item.price}</span>
                            <Badge variant="outline">{item.category}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{item.views} views</span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3" />
                              <span>{item.likes}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="purchases">
                <Card className="backdrop-blur-sm bg-background/80">
                  <CardHeader>
                    <CardTitle>Purchase History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      No purchases yet. Start shopping to see your order history here!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="backdrop-blur-sm bg-background/80">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Email notifications for new messages</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Push notifications for item updates</span>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Privacy</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Show my profile to other users</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Allow others to message me</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}